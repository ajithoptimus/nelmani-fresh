"""Payments module — Razorpay integration with signature verification."""
import hashlib
import hmac
import razorpay
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional

from src.core.database import get_db
from src.core.deps import get_current_user
from src.core.config import settings
from src.auth.models import User
from src.orders.models import Order, OrderStatus
from src.shared.models import Payment, PaymentStatus

router = APIRouter(prefix="/payments", tags=["Payments"])


def get_razorpay_client() -> razorpay.Client:
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


# ── Schemas ───────────────────────────────────────────────────────────────────
class CreateOrderRequest(BaseModel):
    order_id: int  # Our internal order ID


class CreateOrderResponse(BaseModel):
    razorpay_order_id: str
    amount: int  # In paise
    currency: str
    key_id: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: int


class PaymentResponse(BaseModel):
    success: bool
    order_number: str
    message: str


# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.post("/create-order", response_model=CreateOrderResponse)
async def create_razorpay_order(
    data: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a Razorpay order for an internal order. Returns razorpay_order_id."""
    # Fetch internal order
    result = await db.execute(
        select(Order).where(
            Order.id == data.order_id,
            Order.user_id == current_user.id,
            Order.status == OrderStatus.PENDING,
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or already processed")

    # Check if payment record already exists
    pay_result = await db.execute(
        select(Payment).where(Payment.order_id == order.id)
    )
    existing_payment = pay_result.scalar_one_or_none()
    if existing_payment and existing_payment.status == PaymentStatus.SUCCESS:
        raise HTTPException(status_code=409, detail="Order already paid")

    # Create Razorpay order
    try:
        client = get_razorpay_client()
        amount_paise = int(order.total * 100)  # Convert INR to paise
        rp_order = client.order.create({
            "amount": amount_paise,
            "currency": settings.CURRENCY,
            "receipt": order.order_number,
            "notes": {
                "order_id": str(order.id),
                "customer_email": current_user.email,
            }
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment gateway error: {str(e)}")

    # Create/update payment record
    if existing_payment:
        existing_payment.razorpay_order_id = rp_order["id"]
        existing_payment.amount = order.total
    else:
        payment = Payment(
            order_id=order.id,
            razorpay_order_id=rp_order["id"],
            amount=order.total,
            currency=settings.CURRENCY,
            status=PaymentStatus.PENDING,
        )
        db.add(payment)

    return CreateOrderResponse(
        razorpay_order_id=rp_order["id"],
        amount=amount_paise,
        currency=settings.CURRENCY,
        key_id=settings.RAZORPAY_KEY_ID,
    )


@router.post("/verify", response_model=PaymentResponse)
async def verify_payment(
    data: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Verify Razorpay payment signature and confirm the order."""
    # Verify HMAC signature
    sign_string = f"{data.razorpay_order_id}|{data.razorpay_payment_id}"
    expected_signature = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        sign_string.encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, data.razorpay_signature):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment signature verification failed",
        )

    # Fetch payment and order
    pay_result = await db.execute(
        select(Payment).where(Payment.razorpay_order_id == data.razorpay_order_id)
    )
    payment = pay_result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    order_result = await db.execute(
        select(Order).where(Order.id == data.order_id, Order.user_id == current_user.id)
    )
    order = order_result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Update payment
    payment.razorpay_payment_id = data.razorpay_payment_id
    payment.razorpay_signature = data.razorpay_signature
    payment.status = PaymentStatus.SUCCESS
    payment.paid_at = datetime.now(timezone.utc)

    # Update order status → CONFIRMED → will move to PROCESSING
    order.status = OrderStatus.CONFIRMED
    order.confirmed_at = datetime.now(timezone.utc)

    return PaymentResponse(
        success=True,
        order_number=order.order_number,
        message="Payment successful! Your order is confirmed and processing will begin shortly.",
    )


@router.post("/webhook")
async def razorpay_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Razorpay webhook handler — async confirmation backup.
    Configure webhook URL in Razorpay Dashboard: POST /api/v1/payments/webhook
    """
    body = await request.body()
    received_signature = request.headers.get("X-Razorpay-Signature", "")

    # Verify webhook signature
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, received_signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = await request.json()
    event = payload.get("event")

    if event == "payment.captured":
        payment_entity = payload["payload"]["payment"]["entity"]
        rp_order_id = payment_entity.get("order_id")

        result = await db.execute(
            select(Payment).where(Payment.razorpay_order_id == rp_order_id)
        )
        payment = result.scalar_one_or_none()

        if payment and payment.status != PaymentStatus.SUCCESS:
            payment.status = PaymentStatus.SUCCESS
            payment.razorpay_payment_id = payment_entity.get("id")
            payment.paid_at = datetime.now(timezone.utc)

            order_result = await db.execute(
                select(Order).where(Order.id == payment.order_id)
            )
            order = order_result.scalar_one_or_none()
            if order and order.status == OrderStatus.PENDING:
                order.status = OrderStatus.CONFIRMED
                order.confirmed_at = datetime.now(timezone.utc)

    return {"status": "ok"}
