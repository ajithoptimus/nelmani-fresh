"""Products schemas — Pydantic request/response models."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, field_validator


# ── Variant Schemas ───────────────────────────────────────────────────────────
class VariantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    size_kg: float
    sku: str
    price: float
    compare_at_price: Optional[float]
    stock_quantity: int
    is_available: bool


class VariantCreateRequest(BaseModel):
    size_kg: float
    sku: str
    price: float
    compare_at_price: Optional[float] = None
    stock_quantity: int = 0
    weight_grams: Optional[int] = None


# ── Image Schemas ─────────────────────────────────────────────────────────────
class ImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    url: str
    alt_text: Optional[str]
    is_primary: bool
    sort_order: int


# ── Product Schemas ───────────────────────────────────────────────────────────
class ProductListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name: str
    short_description: str
    is_featured: bool
    primary_image: Optional[str] = None
    starting_price: Optional[float] = None


class ProductDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name: str
    short_description: str
    description: str
    heritage_story: Optional[str]
    origin_region: Optional[str]
    nutritional_info: Optional[str]
    health_benefits: Optional[str]
    cooking_instructions: Optional[str]
    storage_instructions: Optional[str]
    processing_days: int
    packaging_details: Optional[str]
    meta_title: Optional[str]
    meta_description: Optional[str]
    is_active: bool
    is_featured: bool
    created_at: datetime
    variants: List[VariantResponse]
    images: List[ImageResponse]
    average_rating: Optional[float] = None
    review_count: int = 0


class ProductCreateRequest(BaseModel):
    name: str
    short_description: str
    description: str
    heritage_story: Optional[str] = None
    origin_region: Optional[str] = None
    nutritional_info: Optional[str] = None
    health_benefits: Optional[str] = None
    cooking_instructions: Optional[str] = None
    storage_instructions: Optional[str] = None
    processing_days: int = 3
    packaging_details: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    sort_order: int = 0
    variants: List[VariantCreateRequest]


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    heritage_story: Optional[str] = None
    nutritional_info: Optional[str] = None
    health_benefits: Optional[str] = None
    cooking_instructions: Optional[str] = None
    storage_instructions: Optional[str] = None
    processing_days: Optional[int] = None
    packaging_details: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class ProductListParams(BaseModel):
    page: int = 1
    page_size: int = 12
    search: Optional[str] = None
    is_featured: Optional[bool] = None
    sort_by: str = "sort_order"  # sort_order | price_asc | price_desc | newest


class PaginatedProductsResponse(BaseModel):
    items: List[ProductListResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
