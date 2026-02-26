# 🌸 Lotus Aura Boutique

> **Crafted for Her** — A modern women's fashion e-commerce storefront built with Next.js.

Lotus Aura Boutique is a full-stack boutique web app featuring a customer-facing storefront and a password-protected admin panel for managing products and inventory.

---

## ✨ Features

### Storefront
- Dynamic category carousel — auto-generated from admin-managed products
- Featured collections with "New Arrivals" and tag-based filtering
- Product detail pages with multi-image galleries
- Dark / Light mode toggle
- Shopping cart (client-side)
- WhatsApp DM integration for custom orders

### Admin Panel (`/admin`)
- Password-protected via HTTP Basic Auth
- Add, edit, and delete products
- Upload product images (stored via Vercel Blob)
- Manage categories, stock, tags, dispatch time, material, wash care, and pattern
- Toggle product visibility (published/unpublished)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui |
| Database | Turso (LibSQL / SQLite) via [Drizzle ORM](https://orm.drizzle.team) |
| File Storage | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| Deployment | [Vercel](https://vercel.com) |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
# Turso database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Vercel Blob storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# Admin credentials
ADMIN_USER=your-admin-username
ADMIN_PASSWORD=your-admin-password
```

### 3. Push the database schema

```bash
npx drizzle-kit push
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home page
│   ├── admin/            # Admin panel
│   ├── collections/      # Collections / shop page
│   └── products/         # Product detail page
├── components/
│   ├── home/             # Home page sections (Hero, CategoryNav, Featured, etc.)
│   ├── products/         # Product card, grid, filters
│   ├── cart/             # Cart drawer & state
│   └── layout/           # Navbar, Footer
├── db/
│   ├── schema.ts         # Drizzle schema (products, product_images)
│   ├── queries.ts        # DB query helpers
│   └── client.ts         # Turso client setup
├── lib/                  # Utility functions
└── middleware.ts         # Admin route protection (Basic Auth)
```

---

## 🔐 Admin Access

The `/admin` route is protected by HTTP Basic Auth configured via environment variables (`ADMIN_USER` / `ADMIN_PASSWORD`). Do **not** commit credentials to version control.

---

## 📦 Deployment

Deploy instantly on [Vercel](https://vercel.com):

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables in the Vercel dashboard
4. Deploy

---

## Copyright & Usage

Copyright © 2026 Manoj Sadanala. All rights reserved.

This repository contains proprietary source code.  
Unauthorized copying, modification, distribution, or use is strictly prohibited.
