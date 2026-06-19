# Deshiyoshad Organic Food Store

A Next.js 15 App Router e-commerce starter for an organic food brand.

## Features

- Server Components by default
- Static product pages with `generateStaticParams`
- ISR-ready product data layer via `revalidate`
- SEO metadata per product
- Product JSON-LD schema
- Optimized images with `next/image`
- Turbopack dev server
- Optional full-stack API route scaffold
- Vercel-ready deployment

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Vercel settings

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: leave default

## Backend later

You can later replace `lib/products.ts` with database calls from Prisma, MongoDB, Supabase, Contentful, or your own API.

A starter API route exists at:

```txt
app/api/products/route.ts
```
