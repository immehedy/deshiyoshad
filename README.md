# Deshiyoshad — Organic Food Store (Next.js + Contentful)

A bilingual (English / বাংলা) organic food e-commerce frontend built with **Next.js 15 (App Router)**, **Tailwind CSS** and an optional **Contentful CMS** backend.

All content — brand identity, SEO, hero banners, products, categories, reviews, blog posts, video galleries, header/footer contents — is fetched from Contentful **server-side** with caching. If Contentful credentials are missing (or a request fails), every query transparently falls back to the built-in static demo content, so the site always renders.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Variables](#environment-variables)
3. [Architecture](#architecture)
4. [Caching & Revalidation](#caching--revalidation)
5. [Localization](#localization)
6. [Contentful Content Models](#contentful-content-models)
7. [Fallback Behavior](#fallback-behavior)
8. [API Routes](#api-routes)
9. [Project Structure](#project-structure)

---

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # optional: add Contentful keys
npm run dev                        # http://localhost:3000
```

The site works immediately without Contentful using the built-in demo data.

### With Contentful

1. Create a Contentful space (see [Content Models](#contentful-content-models) below for every model/field).
2. Add locales in Contentful: **Settings → Locales**. Defaults expected: `en-US` (default) and `bn-BD`. If you use different codes, set `CONTENTFUL_LOCALE_EN` / `CONTENTFUL_LOCALE_BN`.
3. Create and publish content.
4. Fill `.env.local` with your Space ID + Content Delivery API token.
5. Restart the dev server / redeploy.

---

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `CONTENTFUL_SPACE_ID` | no | — | Contentful space ID. Empty ⇒ static fallback mode. |
| `CONTENTFUL_ACCESS_TOKEN` | no | — | Content Delivery API (read-only) access token. |
| `CONTENTFUL_ENVIRONMENT` | no | `master` | Contentful environment. |
| `CONTENTFUL_LOCALE_EN` | no | `en-US` | Contentful locale code for the `/en` site. |
| `CONTENTFUL_LOCALE_BN` | no | `bn-BD` | Contentful locale code for the `/bn` site. |
| `REVALIDATE_SECRET` | recommended | — | Shared secret for the `/api/revalidate` webhook. |

---

## Architecture

```
app/[locale]/...            Pages (RSC). ISR: revalidate = 3600
        │
        ▼
lib/contentful/queries.ts   The only data API used by pages.
        │                   Always returns complete data:
        │                   CMS when available → static/dict fallback otherwise
        │
        ├─► lib/contentful/client.ts   Thin REST wrapper over cdn.contentful.com
        │                               using native fetch() → Next.js Data Cache
        │                               (tag: "contentful", revalidate: 3600)
        │
        ├─► lib/products.ts            Built-in localized demo products/categories
        │
        └─► lib/i18n/dictionaries/     UI string fallbacks (en.json / bn.json)
```

Key decisions for performance:

- **Zero Contentful SDK dependency.** Queries hit `cdn.contentful.com` directly with the platform `fetch`, which unlocks Next.js Data Cache, request deduplication and tag-based invalidation without any adapter.
- **All CMS fetching is server-side** (React Server Components). The browser never talks to Contentful; the delivery token never reaches the client.
- **ISR everywhere.** `export const revalidate = 3600` on all content pages — they are prerendered (SSG at build for known params) and regenerated at most hourly, or instantly via the [revalidation webhook](#caching--revalidation).
- **Parallel data loading.** Pages use `Promise.all(...)` so independent Contentful queries run concurrently.
- **Single shared layout fetch.** Header/Footer/brand data is fetched once in `app/[locale]/layout.tsx`, not per page.

---

## Caching & Revalidation

- Every Contentful request is tagged `contentful` with `revalidate: 3600`.
- Pages set `export const revalidate = 3600` (ISR).
- **On-demand revalidation:** create a Contentful webhook (Settings → Webhooks) for *Entry publish / unpublish / archive* events pointing to:

  ```
  POST https://your-domain.com/api/revalidate?secret=<REVALIDATE_SECRET>
  ```

  The route calls `revalidateTag('contentful')`, so published content appears on the next request — no waiting for the hourly ISR window, no rebuilds.

---

## Localization

- Routes: `/en/...` and `/bn/...`. `/` is redirected by middleware (`Accept-Language` or `NEXT_LOCALE` cookie).
- UI chrome strings (buttons, labels) live in `lib/i18n/dictionaries/{en,bn}.json`.
- **CMS content** is localized by Contentful: each query passes the mapped locale (`en-US` / `bn-BD`) and Contentful returns field values for that locale, falling back to the space default locale if a translation is missing (Contentful space setting).

---

## Contentful Content Models

Create these content types in Contentful. Field ID must match exactly (Content Model → field → *Field ID*). Fields marked **L** = enable localization.

### 1. `brand` — Site Settings (single entry)

Brand name, logo, SEO defaults, header/footer contents and contact info. Create **one** entry; the app takes the first.

| Field | Field ID | Type | Localized | Notes |
| --- | --- | --- | --- | --- |
| Brand name | `brandName` | Short text | **L** | Used in header, footer, `<title>` template |
| Tagline | `tagline` | Short text | **L** | Small text under brand name |
| Logo | `logo` | Media (single image) | — | Square ≥ 80×80 recommended |
| Favicon | `favicon` | Media (single image) | — | Optional |
| Top bar text | `topBarText` | Short text | **L** | Green bar above header |
| Order button label | `orderCtaLabel` | Short text | **L** | Header CTA |
| Order button link | `orderCtaHref` | Short text | **L** | e.g. `/checkout` (locale prefix added automatically) |
| Phone (tel) | `phone` | Short text | — | Used for `tel:` links, e.g. `+8809613821489` |
| Phone (display) | `phoneDisplay` | Short text | — | Optional; falls back to `phone` |
| Email | `email` | Short text | — | |
| Address | `address` | Short text | **L** | |
| Footer about | `footerAbout` | Long text | **L** | Footer description paragraph |
| Facebook URL | `socialFacebook` | Short text | — | |
| Instagram URL | `socialInstagram` | Short text | — | |
| YouTube URL | `socialYoutube` | Short text | — | |
| SEO title | `seoTitle` | Short text | **L** | Default `<title>` / OG title |
| SEO description | `seoDescription` | Long text | **L** | |
| OG image | `ogImage` | Media (single image) | — | 1200×630 recommended |

### 2. `heroBanner` — Home Hero / Promo Cards

| Field | Field ID | Type | Localized | Notes |
| --- | --- | --- | --- | --- |
| Internal name | `internalName` | Short text | — | Admin-only (not rendered) |
| Variant | `variant` | Short text | — | `main` (large hero) or `promo` (side cards) |
| Image | `image` | Media (single image) | — | Hero ≥ 1400px wide; promo ≥ 900px |
| Tag / eyebrow | `tag` | Short text | **L** | Small green label |
| Title | `title` | Short text | **L** | |
| Subtitle | `subtitle` | Long text | **L** | |
| Button label | `ctaLabel` | Short text | **L** | |
| Button link | `ctaHref` | Short text | **L** | e.g. `/products` or `#products` |
| Sort order | `sortOrder` | Integer | — | Ascending |

One `main` entry = the large banner. Multiple `promo` entries = the stacked side cards.

### 3. `category` — Product Categories

| Field | Field ID | Type | Localized | Notes |
| --- | --- | --- | --- | --- |
| Title | `title` | Short text | **L** | |
| Slug | `slug` | Short text | — | URL: `/[locale]/category/[slug]`, must be unique |
| Description | `description` | Long text | **L** | Optional |
| Image | `image` | Media (single image) | — | Optional |
| Sort order | `sortOrder` | Integer | — | Ascending |

### 4. `product` — Products

| Field | Field ID | Type | Localized | Notes |
| --- | --- | --- | --- | --- |
| Name | `name` | Short text | **L** | |
| Slug | `slug` | Short text | — | URL: `/[locale]/product/[slug]`, unique |
| Short description | `shortDescription` | Long text | **L** | Card + meta description |
| Description | `description` | Long text | **L** | Detail page body |
| Price | `price` | Number | — | BDT |
| Compare-at price | `compareAtPrice` | Number | — | Optional; enables discount badge |
| Weight / size | `weight` | Short text | — | e.g. `500g` |
| Badge | `badge` | Short text | **L** | Card badge, e.g. "Best Seller" |
| Category | `category` | Reference (single) → `category` | — | Drives category pages |
| Images | `images` | Media (many images) | — | First image = cover; rest = gallery |
| Benefits | `benefits` | Short text, list | **L** | |
| Ingredients | `ingredients` | Short text, list | **L** | |
| Nutrition | `nutrition` | Short text, list | **L** | Format: `Label: Value`, e.g. `Energy: 898 kcal / 100g` |
| Featured | `featured` | Boolean | — | Reserved for future filtering |
| Sort order | `sortOrder` | Integer | — | Ascending |

### 5. `review` — Reviews / Testimonials

| Field | Field ID | Type | Localized | Notes |
| --- | --- | --- | --- | --- |
| Reviewer name | `reviewerName` | Short text | **L** | |
| Rating | `rating` | Integer | — | 1–5 |
| Review text | `text` | Long text | **L** | |
| Avatar | `avatar` | Media (single image) | — | Optional |
| Product | `product` | Reference (single) → `product` | — | **Empty = site-wide** testimonial (home page). Set = product page review. |

### 6. `videoAlbum` — Gallery Album

| Field | Field ID | Type | Localized | Notes |
| --- | --- | --- | --- | --- |
| Title | `title` | Short text | **L** | Section heading on home page |
| Items | `items` | Reference (many) → `videoItem` | — | |
| Sort order | `sortOrder` | Integer | — | Ascending |

### 7. `videoItem` — Video (link or uploaded file)

| Field | Field ID | Type | Localized | Notes |
| --- | --- | --- | --- | --- |
| Title | `title` | Short text | **L** | |
| Thumbnail | `thumbnail` | Media (single image) | — | 16:9 recommended |
| Video URL | `videoUrl` | Short text | — | External link (YouTube etc.) — renders as a link card |
| Video file | `videoFile` | Media (single video) | — | Uploaded video — rendered as `<video>` player |
| Sort order | `sortOrder` | Integer | — | Ascending |

If both are set, `videoUrl` wins.

### 8. `blogPost` — Blog Cards

| Field | Field ID | Type | Localized | Notes |
| --- | --- | --- | --- | --- |
| Title | `title` | Short text | **L** | |
| Slug | `slug` | Short text | — | Optional, used as React key |
| Excerpt | `excerpt` | Long text | **L** | |
| Tag | `tag` | Short text | **L** | e.g. "Health Tips" |
| Image | `image` | Media (single image) | — | Optional |
| Publish date | `publishDate` | Date & time | — | Shown as `DD Mon` on the card |
| Sort order | `sortOrder` | Integer | — | Ascending |

### 9. `section` — Generic Content Sections

Reusable marketing sections fetched by key. Currently used: `home-trust` (home page trust CTA).

| Field | Field ID | Type | Localized | Notes |
| --- | --- | --- | --- | --- |
| Key | `key` | Short text | — | `home-trust` |
| Eyebrow | `eyebrow` | Short text | **L** | Small green label |
| Heading | `heading` | Short text | **L** | |
| Body | `body` | Long text | **L** | |
| Button label | `ctaLabel` | Short text | **L** | Optional |
| Button link | `ctaHref` | Short text | **L** | Optional, e.g. `/contact` |

---

## Fallback Behavior

| Condition | Result |
| --- | --- |
| Env vars missing | Pure static site — zero CMS requests, zero latency overhead |
| Content type has no entries | Static demo content for that model |
| Query/CDN error (network, bad token) | Logs a `[contentful]` warning, renders static demo content |
| Field missing on an entry | Sensible empty value (`''`, `null`); optional sections simply don't render |

Static demo data lives in `lib/products.ts` (products/categories) and `lib/i18n/dictionaries/*.json` (all other strings).

---

## API Routes

| Route | Description |
| --- | --- |
| `GET /api/products?lang=en\|bn` | Product list (CMS or fallback) |
| `POST /api/revalidate?secret=...` | Contentful webhook → `revalidateTag('contentful')` |

---

## Project Structure

```
app/
  [locale]/                  Locale-scoped routes (en / bn)
    layout.tsx               Brand, SEO metadata, Header/Footer/FloatingCart
    page.tsx                 Home (hero, products, blog, reviews, videos, trust)
    products/page.tsx        Product list + category chips
    category/[slug]/page.tsx Category-filtered products
    product/[slug]/page.tsx  Product detail, gallery, tabs, JSON-LD
    cart/page.tsx            Server shell + client cart (localStorage)
    checkout/page.tsx        Server shell + client COD checkout (ntfy)
    not-found.tsx
  api/
    products/route.ts
    revalidate/route.ts
components/                  Client/server components (Header, Footer, cards, ...)
lib/
  contentful/
    config.ts                Env, locale mapping, cache tag constants
    client.ts                Typed REST client (native fetch, tag: contentful)
    queries.ts               Public data API + mappers + fallbacks
  i18n/                      Locales, dictionaries, provider, getDictionary
  products.ts                Built-in demo products & categories
  cart-store.ts              localStorage cart
  types.ts                   Domain types (BrandConfig, Product, ...)
middleware.ts                Locale detection & redirect
```

## Scripts

```bash
npm run dev     # Dev server (Turbopack)
npm run build   # Production build
npm run start   # Production server
npm run lint    # ESLint
```
