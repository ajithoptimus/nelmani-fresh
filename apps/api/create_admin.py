import asyncio
from src.core.database import AsyncSessionLocal
from src.auth.models import User, UserRole
from src.shared.models import *
from src.orders.models import *
from src.products.models import *
from src.core.security import get_password_hash
from sqlalchemy import select

async def create_admin():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == "admin@nelmanifresh.com"))
        existing_admin = result.scalar_one_or_none()
        
        if existing_admin:
            existing_admin.role = UserRole.ADMIN
            await session.commit()
            print("Updated existing user to ADMIN role.")
            return

        admin_user = User(
            email="admin@nelmanifresh.com",
            hashed_password=get_password_hash("Nelmani@123"),
            full_name="Nelmani Admin",
            role=UserRole.ADMIN,
            is_email_verified=True,
            is_active=True
        )
        session.add(admin_user)
        await session.commit()
        print("Created default admin user: admin@nelmanifresh.com / Nelmani@123")

if __name__ == "__main__":
    asyncio.run(create_admin())
