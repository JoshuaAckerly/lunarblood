# Lunarblood API Documentation Outline

Last updated: 2026-02-18

## 1) Scope

This outline documents the current Lunarblood endpoint inventory and baseline patterns for:
- authentication/authorization
- request validation and sanitization
- error response behavior

Code sources reviewed:
- `routes/api.php`
- `routes/web.php`
- `routes/settings.php`
- `app/Http/Controllers/DashboardController.php`
- `app/Http/Controllers/Settings/ProfileController.php`
- `app/Http/Controllers/Settings/PasswordController.php`
- `app/Exceptions/Handler.php`

## 2) Endpoint Inventory

### 2.1 JSON API (`/api/*`)

| Method | Path | Purpose | Middleware |
|---|---|---|---|
| `POST` | `/api/process-payment` | Payment processing request intake | `throttle:5,1` |
| `POST` | `/api/contact` | Contact form intake | `throttle:3,1` |
| `GET` | `/api/health` | Service/API heartbeat response | `throttle:60,1` |

### 2.2 Authenticated web/data endpoints

| Method | Path | Purpose | Middleware |
|---|---|---|---|
| `GET` | `/dashboard` | Dashboard page render (Inertia) | `auth`, `verified` |
| `GET` | `/dashboard/data` | Dashboard JSON refresh payload | `auth`, `verified` |

### 2.3 Settings endpoints (authenticated)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/settings/profile` | Profile settings page |
| `PATCH` | `/settings/profile` | Profile update |
| `DELETE` | `/settings/profile` | Account deletion |
| `GET` | `/settings/password` | Password settings page |
| `PUT` | `/settings/password` | Password update (`throttle:6,1`) |
| `GET` | `/settings/appearance` | Appearance settings page |

## 3) Authentication & Access Patterns

### 3.1 Protected route groups

- Dashboard endpoints are wrapped in `Route::middleware(['auth', 'verified'])`.
- Settings endpoints are wrapped in `Route::middleware('auth')`.

### 3.2 Current auth route posture

- Traditional auth pages/routes are present in `routes/auth.php` but currently commented out.
- `web.php` redirects `/login`, `/register`, and related auth paths to `/`.

## 4) Validation & Sanitization Patterns

### 4.1 API request validation

- `/api/process-payment` validates required identity/address/payment fields and enforces regex checks for expiry and CVV.
- `/api/contact` validates required `name`, `email`, and `message` bounds.

### 4.2 Input sanitization examples

- `strip_tags()`, `trim()`, and case normalization are applied before processing in API closures.
- Payment card digits are normalized to numeric-only values before length checks.

### 4.3 Form-request validation

- `ProfileUpdateRequest` validates `name` and unique/lowercase `email` constraints for profile updates.
- Password update validates `current_password` plus default password rule + confirmation.

## 5) Error Handling Patterns

### 5.1 Validation failures

- API validation failures return `422` with JSON structure:
  - `success: false`
  - `message`
  - `errors` (validator details)

### 5.2 Domain/business validation failures

- API closures return `422` with `success: false` and a generic validation message when sanitized payload checks fail.

### 5.3 Global exception rendering

- `app/Exceptions/Handler.php` renders Inertia error pages for HTTP `404`, `403`, `500`, and `503` on HTML/Inertia requests.
- Non-HTML/non-Inertia requests fall back to Laravel default exception rendering.

### 5.4 Dashboard refresh failure behavior

- `GET /dashboard/data` catches server-side exceptions and returns `500` JSON:
  - `message: "Unable to refresh dashboard data right now."`

## 6) Response Shape Reference (Current)

### 6.1 `/api/health` success

```json
{
  "status": "ok",
  "timestamp": "2026-02-18T..."
}
```

### 6.2 `/api/process-payment` success

```json
{
  "success": true,
  "message": "Payment processed successfully",
  "order_id": "LB-XXXXXXXXX"
}
```

### 6.3 `/dashboard/data` success

```json
{
  "dashboard": {
    "stats": {
      "venues": 0,
      "shows_total": 0,
      "shows_upcoming": 0,
      "products_active": 0,
      "products_low_stock": 0
    },
    "upcoming_shows": [],
    "low_stock_products": [],
    "generated_at": "2026-02-18T..."
  }
}
```

## 7) Gaps / Next Draft Expansion

- Add OpenAPI-style parameter/response schemas for each `/api/*` endpoint.
- Define canonical error envelope for all JSON endpoints.
- Add authentication strategy note if auth routes are re-enabled.
- Add test matrix linking endpoint to feature/integration coverage.
