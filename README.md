# Nelmani Fresh — Monorepo

> Freshly Processed Kerala Heritage Rice  
> Parent Company: SyntharaSight Private Limited

## Project Structure

```
Nelmani-Fresh/
├── apps/
│   ├── web/          # Next.js 15 frontend (Vercel)
│   └── api/          # FastAPI backend (Railway/VPS)
├── packages/
│   └── shared-types/ # Shared TypeScript types
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Quick Start

### Prerequisites
- Node.js >= 20
- pnpm >= 9
- Python >= 3.11
- PostgreSQL (Neon account)

### Setup

```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd apps/api && pip install -r requirements.txt

# Configure environment variables
cp apps/web/.env.local.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Run database migrations
cd apps/api && alembic upgrade head

# Start development servers
pnpm dev
```

### Environment Variables

See `apps/web/.env.local.example` and `apps/api/.env.example` for required variables.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion |
| Backend | FastAPI, Python 3.11, SQLAlchemy 2.0, Alembic |
| Database | PostgreSQL (Neon) |
| Auth | JWT (RS256), Role-based access |
| Storage | Cloudinary |
| Payments | Razorpay |
| Deployment | Vercel (web) + Railway (api) |
