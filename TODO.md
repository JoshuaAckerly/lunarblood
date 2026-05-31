# TODO - Lunar Blood

## 🔒 Security
- [x] CSRF protection validation
- [x] Rate limiting for API endpoints
- [x] Add request validation
- [x] Set up security headers (middleware with CSP, HSTS, XCPDP, COOP, CORP)
- [x] Audit dependencies for vulnerabilities (npm audit fix -- 0 vulns)
- [ ] Review file upload security
- [ ] Input sanitization review (controller-level, beyond form request validation)

## 🚀 CI/CD & Infrastructure
- [x] Set up CI/CD pipeline (GitHub Actions CI + CD via SSH)
- [x] FORCE_JAVASCRIPT_ACTIONS_TO_NODE24 (Node 24 migration)
- [x] deploy-production.sh: git fetch + reset --hard (divergent branch fix)
- [ ] Add monitoring and logging (error tracking e.g. Sentry)

## 🎨 UI/UX
- [x] Build reusable form components (Input, Select, Textarea, FormField)
- [x] Add toast notification system
- [x] Loading states and skeletons (Skeleton components used in dashboard)
- [x] Responsive mobile layout
- [x] Error handling pages (404, 500, 403)
- [x] Add pagination components (venues paginate(12), shows paginate(15), Pagination.tsx component)
- [ ] Optimize for accessibility (WCAG compliance -- aria labels, heading hierarchy)
- [ ] Implement dark/light theme toggle
- [ ] Implement modal dialogs (confirmations, quick-view)

## 🔧 Technical
- [x] Set up automated testing pipeline
- [x] Implement proper error boundaries
- [x] Comprehensive test coverage (unit + feature)
- [x] Add image optimization (all img tags have loading="lazy" decoding="async"; aspect-ratio containers prevent CLS)
- [ ] Set up caching strategies (query caching for albums/venues/shows)
- [ ] Implement soft deletes (shows, products)
- [ ] Bundle size optimization

## 📱 Features
- [x] Search functionality (search.tsx -- venues, shows, products)
- [x] Email service integration
- [x] Analytics tracking (initializeGoogleAnalytics wired in app.tsx via VITE_GA_MEASUREMENT_ID; no-ops silently if unset)

## 🐛 Known Issues
- [x] console.warn in use-google-analytics.ts — now only fires in DEV mode
- [ ] Edge cases: empty cart checkout, duplicate order submission

## 🤖 Automation
- [ ] Add Dependabot (`.github/dependabot.yml`) for npm + composer automated dependency PRs

## ✅ Completed
- [x] Initial project setup with Laravel + React + Inertia
- [x] Basic routing, dev environment, formatting/linting
- [x] Navigation menu system
- [x] Listen page with audio player and discography
- [x] Venues listing and detail pages
- [x] Tour page with show listings and ticket purchasing
- [x] Shop system with product listings, detail pages, size/quantity selection
- [x] Checkout flow with payment form validation
- [x] Order success page
- [x] Core database schema (venues, shows, products, albums, tracks)
- [x] Eloquent models, relationships, type casting, query scopes
- [x] Database seeders (venues, products, albums)
- [x] PHPUnit test suite -- unit + feature, model factories, RefreshDatabase
- [x] API rate limiting (payment 5/min, contact 3/min)
- [x] Mobile-responsive layout with hamburger menu
