# Mango Landing Page

High-converting premium mango landing page for MonoCore Engine.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Axios

## API Integration

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/landing-page` | Banner, products, reviews |
| `GET /api/v1/settings` | bKash number & payment mode |
| `POST /api/v1/order/place-order` | Submit customer order |

## Development

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — landing page (port 3001)
cd mango-landing-page && npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Environment

Copy `.env.local.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
