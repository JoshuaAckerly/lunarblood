# Development Setup - lunarblood

This project is part of a polyrepo development environment with SSR enabled.

## Local Development URLs

- **Application**: http://localhost:8002
- **Vite Dev Server**: http://localhost:5174
- **SSR Server**: http://localhost:13715

## Quick Start

### Individual Project Setup

1. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   # Update .env with your database credentials
   DB_CONNECTION=mysql
   DB_DATABASE=lunarblood
   DB_USERNAME=lunarblood
   DB_PASSWORD=password
   
   # Run migrations
   php artisan migrate
   ```

4. **Build Assets**
   ```bash
   npm run build
   npm run build -- --ssr
   ```

5. **Start Servers**
   ```bash
   # Terminal 1: Laravel
   php artisan serve --port=8002
   
   # Terminal 2: Vite
   npm run dev
   
   # Terminal 3: SSR
   php artisan inertia:start-ssr --port=13715
   ```

### Polyrepo Setup (All Projects)

If running all projects together from the polyrepo root:

```bash
# From /home/joshua/Documents
./scripts/manage-all-projects.sh start    # Start all projects
./scripts/manage-all-projects.sh status   # Check status
./scripts/manage-all-projects.sh stop     # Stop all projects
```

## Port Configuration

This project uses the following ports:

| Service | Port | Purpose |
|---------|------|---------|
| Laravel | 8002 | Main application server |
| Vite | 5174 | Development build server with HMR |
| SSR | 13715 | Inertia.js server-side rendering |

## Environment Variables

### Required Configuration

```env
APP_URL=http://localhost:8002

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lunarblood
DB_USERNAME=lunarblood
DB_PASSWORD=password

# Inertia SSR
INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13715
```

## Development Workflow

### Making Changes

1. **Frontend (React/TypeScript)**
   - Edit files in `resources/js/`
   - Vite will hot reload automatically
   - Build for production: `npm run build && npm run build -- --ssr`

2. **Backend (Laravel/PHP)**
   - Edit files in `app/`, `routes/`, etc.
   - Changes take effect immediately
   - Clear cache if needed: `php artisan cache:clear`

3. **Database Changes**
   - Create migration: `php artisan make:migration`
   - Run migrations: `php artisan migrate`
   - Rollback: `php artisan migrate:rollback`

### Common Commands

```bash
# Clear all caches
php artisan optimize:clear

# Run tests
php artisan test

# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run types
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8002

# Kill process
kill -9 [PID]
```

### Vite Manifest Not Found

```bash
# Build assets
npm run build
npm run build -- --ssr
```

### Database Connection Error

1. Check MySQL is running
2. Verify credentials in `.env`
3. Ensure database exists: `CREATE DATABASE lunarblood;`
4. Run migrations: `php artisan migrate`

### SSR Not Working

1. Verify `.env` has `INERTIA_SSR_ENABLED=true`
2. Check SSR server is running on port 13715
3. Rebuild SSR assets: `npm run build -- --ssr`

## Technology Stack

- **Backend**: Laravel 11.x + PHP 8.3+
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 5
- **SSR**: Inertia.js
- **Database**: MySQL 8.0

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## Polyrepo Structure

This project is part of a polyrepo with 7 Laravel applications:

- graveyardjokes (http://localhost:8000)
- hollowpress (http://localhost:8001)
- lunarblood (http://localhost:8002)
- studio (http://localhost:8003)
- synthveil (http://localhost:8004)
- thevelvetpulse (http://localhost:8005)
- velvetradio (http://localhost:8006)

All projects share the same development approach but maintain separate repositories.
