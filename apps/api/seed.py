import asyncio
from src.core.database import AsyncSessionLocal
from src.products.models import Product, ProductVariant, ProductImage
from sqlalchemy import select

async def seed():
    print("Starting database seed...")
    async with async_session_maker() as session:
        # Check if products already exist
        result = await session.execute(select(Product))
        existing_products = result.scalars().all()
        if existing_products:
            print("Database already seeded with products. Skipping.")
            return

        print("Adding initial products...")
        
        # 1. Rakthashali
        rakthashali = Product(
            slug="rakthashali-rice",
            name="Rakthashali Rice",
            short_description="Traditional Kerala red rice variety known for its rich color and heritage value.",
            description="Rakthashali is a rare, highly nutritious red rice variety from Kerala, renowned in Ayurveda for its health benefits.",
            is_featured=True,
            is_active=True,
            sort_order=1
        )
        session.add(rakthashali)
        await session.flush()
        
        session.add(ProductVariant(product_id=rakthashali.id, size_kg=1.0, sku="RAK-1KG", price=180.0, stock_quantity=100))
        session.add(ProductImage(product_id=rakthashali.id, cloudinary_public_id="local_rakthashali", url="/images/product_rakthashali.png", is_primary=True))

        # 2. Uma Matta
        uma_matta = Product(
            slug="uma-matta-rice",
            name="Uma Matta Rice",
            short_description="Traditional Kerala Matta rice suitable for daily family consumption.",
            description="Uma Matta is the staple diet of Kerala. It is parboiled, earthy in flavor, and rich in fiber.",
            is_featured=True,
            is_active=True,
            sort_order=2
        )
        session.add(uma_matta)
        await session.flush()
        
        session.add(ProductVariant(product_id=uma_matta.id, size_kg=1.0, sku="UMA-1KG", price=120.0, stock_quantity=100))
        session.add(ProductImage(product_id=uma_matta.id, cloudinary_public_id="local_uma_matta", url="/images/product_uma_matta.png", is_primary=True))

        # 3. Ponmani Matta
        ponmani_matta = Product(
            slug="ponmani-matta-rice",
            name="Ponmani Matta Rice",
            short_description="Premium Kerala Matta rice with rich flavor and texture.",
            description="Ponmani Matta features plump grains that stay separated after cooking. Perfect for Sadya and everyday meals.",
            is_featured=True,
            is_active=True,
            sort_order=3
        )
        session.add(ponmani_matta)
        await session.flush()
        
        session.add(ProductVariant(product_id=ponmani_matta.id, size_kg=1.0, sku="PON-1KG", price=150.0, stock_quantity=100))
        session.add(ProductImage(product_id=ponmani_matta.id, cloudinary_public_id="local_ponmani", url="/images/product_ponmani_matta.png", is_primary=True))

        await session.commit()
        print("Seed complete! Added 3 heritage rice varieties.")

if __name__ == "__main__":
    asyncio.run(seed())
