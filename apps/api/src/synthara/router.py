from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from src.core.database import get_db
from src.products.models import ProductVariant, Product
from src.synthara.auth import require_synthara_token

router = APIRouter(prefix="/synthara", tags=["Synthara Webhooks"])


class DirectivePayload(BaseModel):
    decision_id: str
    directive_type: str  # e.g., "PAUSE_SALES", "UPDATE_PRICE"
    target_system: str   # e.g., "nelmani-fresh"
    payload: Dict[str, Any]


@router.post("/webhook", dependencies=[Depends(require_synthara_token)])
async def handle_synthara_directive(
    directive: DirectivePayload,
    db: AsyncSession = Depends(get_db),
):
    """
    Webhook endpoint for Synthara Vision Brain to automatically act upon Nelmani Fresh.
    """
    if directive.target_system != "nelmani-fresh":
        raise HTTPException(status_code=400, detail="Directive not intended for Nelmani Fresh")

    # ── 1. Execute PAUSE_SALES Directive ───────────────────────────────────────
    if directive.directive_type == "PAUSE_SALES":
        target_product_slug = directive.payload.get("target_product", "matta-rice").lower()
        
        # Find the product variants and pause them
        result = await db.execute(
            select(ProductVariant)
            .join(Product)
            .where(Product.slug.ilike(f"%{target_product_slug}%"))
        )
        variants = result.scalars().all()
        
        if not variants:
            return {"status": "skipped", "message": f"No products found matching '{target_product_slug}'"}

        for variant in variants:
            variant.is_available = False
            variant.stock_quantity = 0
            
        await db.commit()
        return {
            "status": "success",
            "message": f"Successfully paused sales for {len(variants)} variants of '{target_product_slug}'",
            "decision_id": directive.decision_id
        }

    # ── 2. Execute UPDATE_PRICE Directive ──────────────────────────────────────
    if directive.directive_type == "UPDATE_PRICE":
        target_product_slug = directive.payload.get("target_product", "matta-rice").lower()
        new_price_multiplier = float(directive.payload.get("multiplier", 1.0))
        
        result = await db.execute(
            select(ProductVariant)
            .join(Product)
            .where(Product.slug.ilike(f"%{target_product_slug}%"))
        )
        variants = result.scalars().all()
        
        for variant in variants:
            variant.price = round(variant.price * new_price_multiplier, 2)
            
        await db.commit()
        return {
            "status": "success",
            "message": f"Successfully updated prices for {len(variants)} variants",
            "decision_id": directive.decision_id
        }

    # ── Unknown Directive ──────────────────────────────────────────────────────
    return {"status": "ignored", "message": f"Unknown directive type: {directive.directive_type}"}
