"""Products router — /api/v1/products endpoints."""
import math
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from src.core.database import get_db
from src.core.deps import get_current_admin
from src.products.service import ProductService
from src.products.schemas import (
    ProductDetailResponse,
    ProductListResponse,
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductListParams,
    PaginatedProductsResponse,
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=PaginatedProductsResponse)
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
    search: Optional[str] = Query(None),
    is_featured: Optional[bool] = Query(None),
    sort_by: str = Query("sort_order"),
    db: AsyncSession = Depends(get_db),
):
    """List all active products with optional search and filters."""
    params = ProductListParams(
        page=page, page_size=page_size,
        search=search, is_featured=is_featured, sort_by=sort_by
    )
    service = ProductService(db)
    products, total = await service.get_all(params)

    items = []
    for p in products:
        primary_image = next(
            (img.url for img in p.images if img.is_primary), 
            p.images[0].url if p.images else None
        )
        starting_price = min(v.price for v in p.variants) if p.variants else None
        items.append(ProductListResponse(
            id=p.id, slug=p.slug, name=p.name,
            short_description=p.short_description,
            is_featured=p.is_featured,
            primary_image=primary_image,
            starting_price=starting_price,
        ))

    return PaginatedProductsResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size),
    )


@router.get("/{slug}", response_model=ProductDetailResponse)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    """Get full product details by slug."""
    service = ProductService(db)
    product = await service.get_by_slug(slug)

    # Compute average rating from approved reviews
    approved_reviews = [r for r in product.reviews if r.is_approved]
    avg_rating = (
        sum(r.rating for r in approved_reviews) / len(approved_reviews)
        if approved_reviews else None
    )

    return ProductDetailResponse(
        **{k: getattr(product, k) for k in ProductDetailResponse.model_fields if hasattr(product, k)},
        variants=product.variants,
        images=product.images,
        average_rating=avg_rating,
        review_count=len(approved_reviews),
    )


@router.post("", response_model=ProductDetailResponse, status_code=201)
async def create_product(
    data: ProductCreateRequest,
    db: AsyncSession = Depends(get_db),
    _: any = Depends(get_current_admin),
):
    """Create a new product. Admin only."""
    service = ProductService(db)
    product = await service.create(data)
    return await service.get_by_slug(product.slug)


@router.put("/{product_id}", response_model=ProductDetailResponse)
async def update_product(
    product_id: int,
    data: ProductUpdateRequest,
    db: AsyncSession = Depends(get_db),
    _: any = Depends(get_current_admin),
):
    """Update product details. Admin only."""
    service = ProductService(db)
    product = await service.update(product_id, data)
    return await service.get_by_slug(product.slug)


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _: any = Depends(get_current_admin),
):
    """Soft-delete a product. Admin only."""
    service = ProductService(db)
    await service.delete(product_id)
