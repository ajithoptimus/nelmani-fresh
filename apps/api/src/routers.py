"""Cart, Addresses, Reviews, Blog, Uploads, Admin routers."""
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
import cloudinary
import cloudinary.uploader

from src.core.database import get_db
from src.core.deps import get_current_user, get_current_admin
from src.core.config import settings
from src.auth.models import User
from src.products.models import ProductVariant, Product
from src.orders.models import Order, OrderStatus
from src.shared.models import CartItem, Address, Review, BlogPost, Payment, PaymentStatus


# ══════════════════════════════════════════════════════════════════════════════
# CART ROUTER
# ══════════════════════════════════════════════════════════════════════════════
cart_router = APIRouter(prefix="/cart", tags=["Cart"])


class CartItemRequest(BaseModel):
    variant_id: int
    quantity: int = 1


class CartItemResponse(BaseModel):
    id: int
    variant_id: int
    product_name: str
    product_slug: str
    size_kg: float
    quantity: int
    unit_price: float
    total_price: float
    primary_image: Optional[str] = None

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float
    shipping_fee: float
    total: float
    item_count: int


def calc_shipping(subtotal: float) -> float:
    return 0.0 if subtotal >= settings.FREE_SHIPPING_THRESHOLD else settings.BASE_SHIPPING_FEE


@cart_router.get("", response_model=CartResponse)
async def get_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(CartItem).where(CartItem.user_id == current_user.id)
        .options(
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.images)
        )
    )
    items = result.scalars().all()
    subtotal = sum(ci.variant.price * ci.quantity for ci in items)
    shipping = calc_shipping(subtotal)

    cart_items = []
    for ci in items:
        p = ci.variant.product
        primary_img = next((img.url for img in p.images if img.is_primary), None)
        cart_items.append(CartItemResponse(
            id=ci.id, variant_id=ci.variant_id,
            product_name=p.name, product_slug=p.slug,
            size_kg=ci.variant.size_kg,
            quantity=ci.quantity,
            unit_price=ci.variant.price,
            total_price=ci.variant.price * ci.quantity,
            primary_image=primary_img,
        ))

    return CartResponse(
        items=cart_items, subtotal=subtotal,
        shipping_fee=shipping, total=subtotal + shipping,
        item_count=sum(ci.quantity for ci in items),
    )


@cart_router.post("/items", response_model=CartItemResponse, status_code=201)
async def add_to_cart(
    data: CartItemRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check variant exists
    v_result = await db.execute(
        select(ProductVariant).where(
            ProductVariant.id == data.variant_id, ProductVariant.is_available == True
        ).options(selectinload(ProductVariant.product).selectinload(Product.images))
    )
    variant = v_result.scalar_one_or_none()
    if not variant:
        raise HTTPException(status_code=404, detail="Product variant not available")

    # Check if already in cart
    existing = await db.execute(
        select(CartItem).where(
            CartItem.user_id == current_user.id, CartItem.variant_id == data.variant_id
        )
    )
    cart_item = existing.scalar_one_or_none()

    if cart_item:
        cart_item.quantity += data.quantity
    else:
        cart_item = CartItem(
            user_id=current_user.id, variant_id=data.variant_id, quantity=data.quantity
        )
        db.add(cart_item)

    await db.flush()
    p = variant.product
    primary_img = next((img.url for img in p.images if img.is_primary), None)
    return CartItemResponse(
        id=cart_item.id, variant_id=cart_item.variant_id,
        product_name=p.name, product_slug=p.slug,
        size_kg=variant.size_kg, quantity=cart_item.quantity,
        unit_price=variant.price, total_price=variant.price * cart_item.quantity,
        primary_image=primary_img,
    )


@cart_router.patch("/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: int, data: CartItemRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .options(selectinload(CartItem.variant).selectinload(ProductVariant.product).selectinload(Product.images))
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    item.quantity = max(1, data.quantity)
    p = item.variant.product
    primary_img = next((img.url for img in p.images if img.is_primary), None)
    return CartItemResponse(
        id=item.id, variant_id=item.variant_id,
        product_name=p.name, product_slug=p.slug,
        size_kg=item.variant.size_kg, quantity=item.quantity,
        unit_price=item.variant.price, total_price=item.variant.price * item.quantity,
        primary_image=primary_img,
    )


@cart_router.delete("/items/{item_id}", status_code=204)
async def remove_cart_item(
    item_id: int, db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == current_user.id)
    )
    item = result.scalar_one_or_none()
    if item:
        await db.delete(item)


@cart_router.delete("", status_code=204)
async def clear_cart(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(CartItem).where(CartItem.user_id == current_user.id))
    for item in result.scalars().all():
        await db.delete(item)


# ══════════════════════════════════════════════════════════════════════════════
# ADDRESSES ROUTER
# ══════════════════════════════════════════════════════════════════════════════
address_router = APIRouter(prefix="/addresses", tags=["Addresses"])


class AddressRequest(BaseModel):
    name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    district: str
    state: str
    pincode: str
    is_default: bool = False


class AddressResponse(BaseModel):
    id: int
    name: str
    phone: str
    address_line1: str
    address_line2: Optional[str]
    city: str
    district: str
    state: str
    pincode: str
    country: str
    is_default: bool

    class Config:
        from_attributes = True


@address_router.get("", response_model=List[AddressResponse])
async def list_addresses(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Address).where(Address.user_id == current_user.id)
        .order_by(Address.is_default.desc(), Address.id.desc())
    )
    return result.scalars().all()


@address_router.post("", response_model=AddressResponse, status_code=201)
async def create_address(
    data: AddressRequest, db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.is_default:
        # Unset existing default
        existing = await db.execute(
            select(Address).where(Address.user_id == current_user.id, Address.is_default == True)
        )
        for addr in existing.scalars().all():
            addr.is_default = False

    addr = Address(user_id=current_user.id, **data.model_dump())
    db.add(addr)
    await db.flush()
    await db.refresh(addr)
    return addr


@address_router.delete("/{address_id}", status_code=204)
async def delete_address(
    address_id: int, db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Address).where(Address.id == address_id, Address.user_id == current_user.id)
    )
    addr = result.scalar_one_or_none()
    if addr:
        await db.delete(addr)


# ══════════════════════════════════════════════════════════════════════════════
# REVIEWS ROUTER
# ══════════════════════════════════════════════════════════════════════════════
review_router = APIRouter(prefix="/products", tags=["Reviews"])


class ReviewRequest(BaseModel):
    rating: int
    title: Optional[str] = None
    body: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    rating: int
    title: Optional[str]
    body: Optional[str]
    reviewer_name: str
    is_verified_purchase: bool
    created_at: datetime

    class Config:
        from_attributes = True


@review_router.get("/{product_id}/reviews", response_model=List[ReviewResponse])
async def get_reviews(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Review, User.full_name)
        .join(User, Review.user_id == User.id)
        .where(Review.product_id == product_id, Review.is_approved == True)
        .order_by(Review.created_at.desc())
    )
    rows = result.all()
    return [
        ReviewResponse(
            id=r.id, rating=r.rating, title=r.title, body=r.body,
            reviewer_name=name or "Customer",
            is_verified_purchase=r.is_verified_purchase,
            created_at=r.created_at,
        ) for r, name in rows
    ]


@review_router.post("/{product_id}/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(
    product_id: int, data: ReviewRequest, db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not (1 <= data.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # Check verified purchase
    order_result = await db.execute(
        select(Order).where(
            Order.user_id == current_user.id, Order.status == OrderStatus.DELIVERED
        )
    )
    is_verified = order_result.scalar_one_or_none() is not None

    review = Review(
        user_id=current_user.id, product_id=product_id,
        rating=data.rating, title=data.title, body=data.body,
        is_verified_purchase=is_verified, is_approved=False,
    )
    db.add(review)
    await db.flush()
    return ReviewResponse(
        id=review.id, rating=review.rating, title=review.title, body=review.body,
        reviewer_name=current_user.full_name or "Customer",
        is_verified_purchase=is_verified, created_at=review.created_at,
    )


# ══════════════════════════════════════════════════════════════════════════════
# BLOG ROUTER
# ══════════════════════════════════════════════════════════════════════════════
blog_router = APIRouter(prefix="/blog", tags=["Blog"])


class BlogPostResponse(BaseModel):
    id: int
    slug: str
    title: str
    excerpt: str
    category: str
    author: str
    featured_image_url: Optional[str]
    published_at: Optional[datetime]

    class Config:
        from_attributes = True


class BlogPostDetailResponse(BlogPostResponse):
    body: str
    meta_title: Optional[str]
    meta_description: Optional[str]


@blog_router.get("", response_model=List[BlogPostResponse])
async def list_posts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BlogPost).where(BlogPost.is_published == True)
        .order_by(BlogPost.published_at.desc())
    )
    return result.scalars().all()


@blog_router.get("/{slug}", response_model=BlogPostDetailResponse)
async def get_post(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BlogPost).where(BlogPost.slug == slug, BlogPost.is_published == True)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


# ══════════════════════════════════════════════════════════════════════════════
# UPLOADS ROUTER
# ══════════════════════════════════════════════════════════════════════════════
uploads_router = APIRouter(prefix="/uploads", tags=["Uploads"])


class UploadResponse(BaseModel):
    url: str
    public_id: str
    width: int
    height: int


@uploads_router.post("/image", response_model=UploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    folder: str = "nelmani-products",
    _: User = Depends(get_current_admin),
):
    """Upload an image to Cloudinary. Admin only."""
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
    )
    contents = await file.read()
    result = cloudinary.uploader.upload(
        contents,
        folder=folder,
        resource_type="image",
        transformation=[{"quality": "auto", "fetch_format": "auto"}],
    )
    return UploadResponse(
        url=result["secure_url"],
        public_id=result["public_id"],
        width=result["width"],
        height=result["height"],
    )


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN ROUTER
# ══════════════════════════════════════════════════════════════════════════════
admin_router = APIRouter(prefix="/admin", tags=["Admin"])


class DashboardOverview(BaseModel):
    total_orders: int
    total_revenue: float
    total_customers: int
    processing_orders: int
    pending_orders: int
    delivered_orders: int


class OrderAdminResponse(BaseModel):
    id: int
    order_number: str
    status: OrderStatus
    total: float
    customer_email: str
    customer_name: Optional[str]
    created_at: datetime
    items_count: int

    class Config:
        from_attributes = True


@admin_router.get("/analytics/overview", response_model=DashboardOverview)
async def get_dashboard_overview(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    total_orders = (await db.execute(select(func.count(Order.id)))).scalar_one()
    total_revenue = (
        await db.execute(
            select(func.sum(Order.total)).where(
                Order.status.in_([
                    OrderStatus.CONFIRMED, OrderStatus.PROCESSING,
                    OrderStatus.PACKED, OrderStatus.SHIPPED, OrderStatus.DELIVERED
                ])
            )
        )
    ).scalar_one() or 0.0

    total_customers = (await db.execute(select(func.count(User.id)))).scalar_one()
    processing = (await db.execute(
        select(func.count(Order.id)).where(Order.status == OrderStatus.PROCESSING)
    )).scalar_one()
    pending = (await db.execute(
        select(func.count(Order.id)).where(Order.status == OrderStatus.PENDING)
    )).scalar_one()
    delivered = (await db.execute(
        select(func.count(Order.id)).where(Order.status == OrderStatus.DELIVERED)
    )).scalar_one()

    return DashboardOverview(
        total_orders=total_orders, total_revenue=total_revenue,
        total_customers=total_customers, processing_orders=processing,
        pending_orders=pending, delivered_orders=delivered,
    )


@admin_router.get("/orders", response_model=List[OrderAdminResponse])
async def get_all_orders(
    status: Optional[OrderStatus] = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    query = select(Order, User.email, User.full_name).join(User, Order.user_id == User.id)
    if status:
        query = query.where(Order.status == status)
    query = query.order_by(Order.created_at.desc())

    result = await db.execute(query)
    rows = result.all()

    orders = []
    for order, email, name in rows:
        # Get items count
        items_count = len(order.items) if order.items else 0
        orders.append(OrderAdminResponse(
            id=order.id, order_number=order.order_number, status=order.status,
            total=order.total, customer_email=email, customer_name=name,
            created_at=order.created_at, items_count=items_count,
        ))
    return orders


@admin_router.get("/customers")
async def get_customers(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(User, func.count(Order.id).label("order_count"))
        .outerjoin(Order, User.id == Order.user_id)
        .group_by(User.id)
        .order_by(User.created_at.desc())
    )
    rows = result.all()
    return [
        {
            "id": u.id, "email": u.email, "full_name": u.full_name,
            "phone": u.phone, "created_at": u.created_at,
            "order_count": count, "is_active": u.is_active,
        }
        for u, count in rows
    ]


@admin_router.patch("/reviews/{review_id}/approve", status_code=200)
async def approve_review(
    review_id: int, db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_approved = True
    return {"message": "Review approved"}
