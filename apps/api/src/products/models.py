"""Products domain models — Product, ProductVariant, ProductImage."""
import enum
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    String, Text, Integer, Float, Boolean, Enum as SAEnum,
    DateTime, ForeignKey, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    short_description: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    # Heritage & Story
    heritage_story: Mapped[Optional[str]] = mapped_column(Text)
    origin_region: Mapped[Optional[str]] = mapped_column(String(255))

    # Nutritional & Health
    nutritional_info: Mapped[Optional[str]] = mapped_column(Text)  # JSON string
    health_benefits: Mapped[Optional[str]] = mapped_column(Text)   # JSON array string
    cooking_instructions: Mapped[Optional[str]] = mapped_column(Text)
    storage_instructions: Mapped[Optional[str]] = mapped_column(Text)

    # Processing
    processing_days: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    packaging_details: Mapped[Optional[str]] = mapped_column(Text)

    # SEO
    meta_title: Mapped[Optional[str]] = mapped_column(String(255))
    meta_description: Mapped[Optional[str]] = mapped_column(String(500))

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    variants: Mapped[List["ProductVariant"]] = relationship(
        "ProductVariant", back_populates="product", cascade="all, delete-orphan",
        order_by="ProductVariant.size_kg"
    )
    images: Mapped[List["ProductImage"]] = relationship(
        "ProductImage", back_populates="product", cascade="all, delete-orphan",
        order_by="ProductImage.sort_order"
    )
    reviews: Mapped[List["Review"]] = relationship(
        "Review", back_populates="product"
    )
    order_items: Mapped[List["OrderItem"]] = relationship(
        "OrderItem", back_populates="product"
    )

    def __repr__(self) -> str:
        return f"<Product id={self.id} slug={self.slug}>"


class ProductVariant(Base):
    """Represents each weight option: 1kg, 5kg, 10kg."""
    __tablename__ = "product_variants"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    size_kg: Mapped[float] = mapped_column(Float, nullable=False)  # 1.0, 5.0, 10.0
    sku: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    compare_at_price: Mapped[Optional[float]] = mapped_column(Float)  # Strikethrough price
    stock_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    weight_grams: Mapped[Optional[int]] = mapped_column(Integer)  # For shipping calc

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="variants")
    order_items: Mapped[List["OrderItem"]] = relationship(
        "OrderItem", back_populates="variant"
    )
    cart_items: Mapped[List["CartItem"]] = relationship(
        "CartItem", back_populates="variant"
    )

    def __repr__(self) -> str:
        return f"<ProductVariant id={self.id} sku={self.sku} size={self.size_kg}kg>"


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    cloudinary_public_id: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    alt_text: Mapped[Optional[str]] = mapped_column(String(255))
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="images")
