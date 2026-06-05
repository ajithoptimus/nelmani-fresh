"""Orders service — business logic for order creation and status management."""
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
import uuid

from src.orders.models import Order, OrderItem, OrderStatus
from src.shared.models import CartItem, Address, Payment, PaymentStatus
from src.products.models import ProductVariant, Product
from src.auth.models import User


def generate_order_number() -> str:
    """Generate a human-readable order number."""
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d")
    suffix = uuid.uuid4().hex[:5].upper()
    return f"NF-{timestamp}-{suffix}"


async def create_order_from_cart(
    db: AsyncSession,
    user: User,
    address_id: int,
    customer_notes: Optional[str] = None,
) -> Order:
    """
    Create an order from the user's current cart.
    Validates stock, calculates totals, and clears cart.
    """
    # Validate address belongs to user
    addr_result = await db.execute(
        select(Address).where(Address.id == address_id, Address.user_id == user.id)
    )
    address = addr_result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    # Get cart items with eager loading
    cart_result = await db.execute(
        select(CartItem)
        .where(CartItem.user_id == user.id)
        .options(
            selectinload(CartItem.variant).selectinload(ProductVariant.product)
        )
    )
    cart_items = cart_result.scalars().all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Calculate totals
    subtotal = sum(ci.variant.price * ci.quantity for ci in cart_items)
    FREE_SHIPPING_THRESHOLD = 999.0
    BASE_SHIPPING_FEE = 99.0
    shipping_fee = 0.0 if subtotal >= FREE_SHIPPING_THRESHOLD else BASE_SHIPPING_FEE
    total = subtotal + shipping_fee

    # Create order
    order = Order(
        user_id=user.id,
        address_id=address_id,
        order_number=generate_order_number(),
        status=OrderStatus.PENDING,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=total,
        customer_notes=customer_notes,

        # Snapshot address
        delivery_name=address.name,
        delivery_phone=address.phone,
        delivery_address=f"{address.address_line1}"
            + (f", {address.address_line2}" if address.address_line2 else ""),
        delivery_city=address.city,
        delivery_district=address.district,
        delivery_state=address.state,
        delivery_pincode=address.pincode,
    )
    db.add(order)
    await db.flush()  # Get order.id

    # Create order items
    for ci in cart_items:
        item = OrderItem(
            order_id=order.id,
            variant_id=ci.variant_id,
            product_id=ci.variant.product_id,
            product_name=ci.variant.product.name,
            variant_size_kg=ci.variant.size_kg,
            sku=ci.variant.sku,
            quantity=ci.quantity,
            unit_price=ci.variant.price,
            total_price=ci.variant.price * ci.quantity,
        )
        db.add(item)

    # Clear cart
    for ci in cart_items:
        await db.delete(ci)

    await db.flush()
    await db.refresh(order)
    return order


async def update_order_status(
    db: AsyncSession,
    order_id: int,
    new_status: OrderStatus,
    tracking_number: Optional[str] = None,
    courier_name: Optional[str] = None,
    estimated_delivery_date: Optional[datetime] = None,
) -> Order:
    """Update order status with timestamp tracking."""
    result = await db.execute(
        select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    now = datetime.now(timezone.utc)
    order.status = new_status

    # Track status timestamps
    if new_status == OrderStatus.CONFIRMED:
        order.confirmed_at = now
    elif new_status == OrderStatus.PROCESSING:
        order.processing_started_at = now
    elif new_status == OrderStatus.SHIPPED:
        order.shipped_at = now
        if tracking_number:
            order.tracking_number = tracking_number
        if courier_name:
            order.courier_name = courier_name
        if estimated_delivery_date:
            order.estimated_delivery_date = estimated_delivery_date
    elif new_status == OrderStatus.DELIVERED:
        order.delivered_at = now

    await db.flush()
    return order
