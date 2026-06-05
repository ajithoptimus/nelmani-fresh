"""Orders domain models — Order, OrderItem, with full status flow."""
import enum
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    String, Text, Integer, Float, Enum as SAEnum,
    DateTime, ForeignKey, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.database import Base


class OrderStatus(str, enum.Enum):
    PENDING = "pending"           # Payment not confirmed
    CONFIRMED = "confirmed"       # Payment confirmed, awaiting processing
    PROCESSING = "processing"     # Rice being processed
    PACKED = "packed"             # Packed and ready to ship
    SHIPPED = "shipped"           # Dispatched via courier
    DELIVERED = "delivered"       # Delivered to customer
    CANCELLED = "cancelled"       # Cancelled (before processing)
    REFUNDED = "refunded"         # Refund issued


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)

    # User
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    address_id: Mapped[int] = mapped_column(
        ForeignKey("addresses.id", ondelete="RESTRICT"), nullable=False
    )

    # Status
    status: Mapped[OrderStatus] = mapped_column(
        SAEnum(OrderStatus, name="orderstatus"),
        default=OrderStatus.PENDING,
        nullable=False,
        index=True,
    )

    # Pricing
    subtotal: Mapped[float] = mapped_column(Float, nullable=False)
    shipping_fee: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    discount_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total: Mapped[float] = mapped_column(Float, nullable=False)

    # Shipping (future Shiprocket integration)
    tracking_number: Mapped[Optional[str]] = mapped_column(String(100))
    courier_name: Mapped[Optional[str]] = mapped_column(String(100))
    estimated_delivery_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Delivery address snapshot (preserved even if customer edits/deletes address)
    delivery_name: Mapped[Optional[str]] = mapped_column(String(255))
    delivery_phone: Mapped[Optional[str]] = mapped_column(String(30))
    delivery_address: Mapped[Optional[str]] = mapped_column(Text)
    delivery_city: Mapped[Optional[str]] = mapped_column(String(100))
    delivery_district: Mapped[Optional[str]] = mapped_column(String(100))
    delivery_state: Mapped[Optional[str]] = mapped_column(String(100))
    delivery_pincode: Mapped[Optional[str]] = mapped_column(String(10))

    # Notes
    customer_notes: Mapped[Optional[str]] = mapped_column(Text)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    processing_started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    shipped_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="orders")
    address: Mapped["Address"] = relationship("Address")
    items: Mapped[List["OrderItem"]] = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )
    payment: Mapped[Optional["Payment"]] = relationship(
        "Payment", back_populates="order", uselist=False
    )

    def __repr__(self) -> str:
        return f"<Order id={self.id} number={self.order_number} status={self.status}>"


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="RESTRICT"), nullable=False
    )
    variant_id: Mapped[int] = mapped_column(
        ForeignKey("product_variants.id", ondelete="RESTRICT"), nullable=False
    )

    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)   # Price at time of order
    total_price: Mapped[float] = mapped_column(Float, nullable=False)

    # Snapshot for historical accuracy
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    variant_size_kg: Mapped[float] = mapped_column(Float, nullable=False)
    sku: Mapped[Optional[str]] = mapped_column(String(100))  # SKU at time of order

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship("Product", back_populates="order_items")
    variant: Mapped["ProductVariant"] = relationship("ProductVariant", back_populates="order_items")
