"""Orders router — create, list, detail, status update."""
import random
import string
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import List, Optional

from src.core.database import get_db
from src.core.deps import get_current_user, get_current_admin
from src.auth.models import User
from src.orders.models import Order, OrderItem, OrderStatus
from src.products.models import ProductVariant, Product
from src.shared.models import Address, CartItem, Payment, PaymentStatus
from src.core.config import settings

router = APIRouter(prefix="/orders", tags=["Orders"])


# ── Schemas ───────────────────────────────────────────────────────────────────
class CreateOrderRequest(BaseModel):
    address_id: int
    customer_notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    product_name: str
    variant_size_kg: float
    quantity: int
    unit_price: float
    total_price: float


class OrderResponse(BaseModel):
    id: int
    order_number: str
    status: OrderStatus
    subtotal: float
    shipping_fee: float
    total: float
    customer_notes: Optional[str]
    tracking_number: Optional[str]
    courier_name: Optional[str]
    estimated_delivery_date: Optional[datetime]
    created_at: datetime
    confirmed_at: Optional[datetime]
    processing_started_at: Optional[datetime]
    shipped_at: Optional[datetime]
    delivered_at: Optional[datetime]
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class UpdateOrderStatusRequest(BaseModel):
    status: OrderStatus
    tracking_number: Optional[str] = None
    courier_name: Optional[str] = None
    admin_notes: Optional[str] = None


def generate_order_number() -> str:
    """Generate unique order number: NF-YYYYMMDD-XXXXX"""
    from datetime import date
    today = date.today().strftime("%Y%m%d")
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"NF-{today}-{suffix}"


def calculate_shipping(subtotal: float) -> float:
    """Calculate shipping fee. Free above threshold."""
    return 0.0 if subtotal >= settings.FREE_SHIPPING_THRESHOLD else settings.BASE_SHIPPING_FEE


# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.post("", response_model=OrderResponse, status_code=201)
async def create_order(
    data: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create an order from the user's cart. Cart is cleared after order creation."""
    # Verify address belongs to user
    addr_result = await db.execute(
        select(Address).where(
            Address.id == data.address_id,
            Address.user_id == current_user.id
        )
    )
    address = addr_result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    # Fetch cart items
    cart_result = await db.execute(
        select(CartItem)
        .where(CartItem.user_id == current_user.id)
        .options(selectinload(CartItem.variant).selectinload(ProductVariant.product))
    )
    cart_items = cart_result.scalars().all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Calculate totals
    subtotal = sum(ci.variant.price * ci.quantity for ci in cart_items)
    shipping_fee = calculate_shipping(subtotal)
    total = subtotal + shipping_fee

    # Create order
    order = Order(
        order_number=generate_order_number(),
        user_id=current_user.id,
        address_id=address.id,
        status=OrderStatus.PENDING,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=total,
        customer_notes=data.customer_notes,
    )
    db.add(order)
    await db.flush()

    # Create order items
    for ci in cart_items:
        item = OrderItem(
            order_id=order.id,
            product_id=ci.variant.product_id,
            variant_id=ci.variant_id,
            quantity=ci.quantity,
            unit_price=ci.variant.price,
            total_price=ci.variant.price * ci.quantity,
            product_name=ci.variant.product.name,
            variant_size_kg=ci.variant.size_kg,
        )
        db.add(item)
        await db.delete(ci)  # Clear cart item

    await db.flush()

    # Reload with items
    result = await db.execute(
        select(Order).where(Order.id == order.id)
        .options(selectinload(Order.items))
    )
    return result.scalar_one()


@router.get("", response_model=List[OrderResponse])
async def list_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's order history."""
    result = await db.execute(
        select(Order)
        .where(Order.user_id == current_user.id)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific order by ID."""
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id, Order.user_id == current_user.id)
        .options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    data: UpdateOrderStatusRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Update order status. Admin only. Includes manual fulfillment workflow."""
    result = await db.execute(
        select(Order).where(Order.id == order_id)
        .options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    now = datetime.now(timezone.utc)
    order.status = data.status

    # Set status timestamps
    if data.status == OrderStatus.PROCESSING:
        order.processing_started_at = now
    elif data.status == OrderStatus.SHIPPED:
        order.shipped_at = now
        order.tracking_number = data.tracking_number
        order.courier_name = data.courier_name
    elif data.status == OrderStatus.DELIVERED:
        order.delivered_at = now
    elif data.status == OrderStatus.CANCELLED:
        order.cancelled_at = now

    if data.admin_notes:
        order.admin_notes = data.admin_notes

    return order
