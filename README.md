# Lunar Blood

A modern web application built with Laravel 12 and React 19, using Inertia.js for seamless full-stack development.

## 🚀 Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Vite 7
- **Database**: SQLite (default)
- **Testing**: PHPUnit + Jest

## 📋 Prerequisites

- PHP 8.2 or higher
- Node.js 18+ and npm
- Composer
- SQLite (or your preferred database)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lunarblood
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   touch database/database.sqlite
   php artisan migrate
   ```

## 🏃‍♂️ Development

### Start development servers
```bash
composer run dev
```
This starts Laravel server, queue worker, and Vite dev server concurrently.

### Individual commands
```bash
# Laravel server
php artisan serve

# Frontend development
npm run dev

# Queue worker
php artisan queue:listen
```

### Code Quality
```bash
# Format code
npm run format

# Lint code
npm run lint

# Type checking
npm run types

# PHP code style
./vendor/bin/pint
```

## 🧪 Testing

```bash
# Run PHP tests
composer run test

# Run all tests
php artisan test
```

## 🏗️ Building for Production

```bash
# Build frontend assets
npm run build

# Build with SSR support
npm run build:ssr
```

## 📁 Project Structure

```
├── app/                    # Laravel application code
├── resources/
│   ├── js/                # React components and TypeScript
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Page layouts
│   │   └── pages/         # Inertia.js pages
│   └── css/               # Stylesheets
├── routes/                # Laravel routes
├── database/              # Migrations, seeders, factories
├── public/                # Public assets
└── tests/                 # Test files
```

## 🌐 Available Routes

- `/` - Welcome page
- `/dashboard` - Dashboard (authenticated users)

## 🎨 UI Components

This project uses:
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

## 🔧 Configuration

- **TypeScript**: Configured with strict mode
- **ESLint**: React and TypeScript rules
- **Prettier**: Code formatting with Tailwind plugin
- **Tailwind**: Custom configuration with animations

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `composer run dev` | Start all development servers |
| `composer run dev:ssr` | Start with SSR support |
| `npm run build` | Build for production |
| `npm run lint` | Lint and fix code |
| `npm run format` | Format code with Prettier |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.