# lunarblood

## Purpose
Band website with venue and show management, a listen page, shop with products, and tour listing. Supports authenticated CRUD for shows (requires auth + verified). Lightweight — no Radix UI or Headless UI.

## Tech Stack
- **Backend**: Laravel 12, PHP 8.2+, Sanctum (session), Spatie Sitemap
- **Frontend**: React 19, TypeScript, Inertia.js 2, Tailwind CSS 4, **Vite 7** (no Radix/Headless UI)
- **Testing**: PHPUnit 11 (`php artisan test`)
- **Storage**: MySQL (prod), SQLite (tests), optional Redis/S3

## Architecture

### Controllers (`app/Http/Controllers/`)
- `ShowController` — show CRUD (auth + verified middleware)
- `VenueController` — full venue CRUD (no auth required for public routes)
- `DashboardController` — admin dashboard
- `SitemapController` — Spatie Sitemap generation
- `Api/` — API endpoints
- `Auth/` — Breeze auth

### Models (`app/Models/`)
- `Show` — live show events (belongs to Venue)
- `Venue` — venue info (has many Shows)
- `Album` — album catalog
- `Track` — album tracks (belongs to Album)
- `Product` — shop items (accessed directly via `Product::find()` in routes)
- `User`

### Routes (`routes/web.php`)
```php
// Public
GET  /          → welcome
GET  /listen    → listen page
GET  /venues    → venue index
GET  /venues/{venue}        → venue detail
GET  /venues/create         → create form
POST /venues                → store venue
GET  /venues/{venue}/edit   → edit form
PUT  /venues/{venue}        → update
DELETE /venues/{venue}      → destroy
GET  /tour      → tour page
GET  /shop      → shop listing
GET  /shop/{id} → product detail (Product::find() from route closure)

// Authenticated (auth + verified)
GET/POST /shows           → show index / create
GET/PUT/DELETE /shows/{show} → show detail / update / destroy
```

### Frontend (`resources/js/`)
- Pages: `pages/` (kebab-case)
- Components: `components/`
- Layouts: `layouts/`
- Hooks: `hooks/`
- SSR entry: `ssr.tsx`

## Key Patterns
- **No Radix or Headless UI** — build components with plain Tailwind and React.
- Venue routes are public (no auth), but show routes require `auth` + `verified`.
- `Product` is fetched with `Product::find()` directly in a route closure — acceptable for this small model.
- Spatie Sitemap used via `SitemapController`.

## Build & Test
```bash
php artisan test
npm run build:ssr
npm run types
npm run lint
./vendor/bin/pint
```

## Notable Files
- `API_DOCUMENTATION.md` — full API reference
- `analyze-errors.sh` — error log analysis script
- `deploy*.sh` — deployment scripts
