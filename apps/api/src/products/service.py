"""Products service — business logic."""
import math
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from python_slugify import slugify

from src.products.models import Product, ProductVariant, ProductImage
from src.products.schemas import (
    ProductCreateRequest, ProductUpdateRequest, ProductListParams
)


class ProductService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, params: ProductListParams) -> Tuple[List[Product], int]:
        """Get paginated list of active products."""
        query = select(Product).where(Product.is_active == True)

        if params.search:
            query = query.where(
                or_(
                    Product.name.ilike(f"%{params.search}%"),
                    Product.short_description.ilike(f"%{params.search}%"),
                )
            )

        if params.is_featured is not None:
            query = query.where(Product.is_featured == params.is_featured)

        # Count
        count_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar_one()

        # Sort
        if params.sort_by == "newest":
            query = query.order_by(Product.created_at.desc())
        else:
            query = query.order_by(Product.sort_order.asc(), Product.id.asc())

        # Paginate
        offset = (params.page - 1) * params.page_size
        query = query.offset(offset).limit(params.page_size)
        query = query.options(
            selectinload(Product.variants),
            selectinload(Product.images),
        )

        result = await self.db.execute(query)
        products = result.scalars().all()
        return list(products), total

    async def get_by_slug(self, slug: str) -> Product:
        """Get a single product by slug with all relationships."""
        result = await self.db.execute(
            select(Product)
            .where(Product.slug == slug, Product.is_active == True)
            .options(
                selectinload(Product.variants),
                selectinload(Product.images),
                selectinload(Product.reviews),
            )
        )
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product '{slug}' not found",
            )
        return product

    async def create(self, data: ProductCreateRequest) -> Product:
        """Create a product with variants."""
        slug = slugify(data.name)

        # Ensure slug uniqueness
        base_slug = slug
        counter = 1
        while True:
            existing = await self.db.execute(
                select(Product).where(Product.slug == slug)
            )
            if not existing.scalar_one_or_none():
                break
            slug = f"{base_slug}-{counter}"
            counter += 1

        product = Product(
            slug=slug,
            name=data.name,
            short_description=data.short_description,
            description=data.description,
            heritage_story=data.heritage_story,
            origin_region=data.origin_region,
            nutritional_info=data.nutritional_info,
            health_benefits=data.health_benefits,
            cooking_instructions=data.cooking_instructions,
            storage_instructions=data.storage_instructions,
            processing_days=data.processing_days,
            packaging_details=data.packaging_details,
            meta_title=data.meta_title,
            meta_description=data.meta_description,
            is_active=data.is_active,
            is_featured=data.is_featured,
            sort_order=data.sort_order,
        )
        self.db.add(product)
        await self.db.flush()

        # Add variants
        for v in data.variants:
            variant = ProductVariant(
                product_id=product.id,
                size_kg=v.size_kg,
                sku=v.sku,
                price=v.price,
                compare_at_price=v.compare_at_price,
                stock_quantity=v.stock_quantity,
                weight_grams=v.weight_grams,
            )
            self.db.add(variant)

        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def update(self, product_id: int, data: ProductUpdateRequest) -> Product:
        result = await self.db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        for field, value in data.model_dump(exclude_none=True).items():
            setattr(product, field, value)

        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def delete(self, product_id: int) -> None:
        result = await self.db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        product.is_active = False  # Soft delete
