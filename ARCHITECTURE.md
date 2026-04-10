# LunarBlood Architecture Documentation

This document provides an overview of the LunarBlood application architecture, design patterns, and technical decisions.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Technology Stack](#technology-stack)
- [Application Layers](#application-layers)
- [Key Features](#key-features)
- [Design Decisions](#design-decisions)

## 🎯 System Overview

LunarBlood is a full-stack web application built with **Laravel 12 backend** and **React 19 frontend**, connected via **Inertia.js** for seamless server-side rendering. The application emphasizes monitoring, analytics, and user engagement.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │          React 19 + TypeScript Frontend          │  │
│  │  (Inertia.js Client / Vite HMR / Tailwind CSS)  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Web Server (Nginx)                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               PHP-FPM / Laravel 12 Backend               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Controllers → Services → Models → Database      │  │
│  │  Monitoring, Analytics, Tracking                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────┬───────────────┬──────────────────────────────────┘
      │               │
┌─────▼────────┐  ┌──▼──────────┐
│   SQLite     │  │  File       │
│   Database   │  │  Storage    │
└──────────────┘  └─────────────┘
```

### Core Principles

1. **Monitoring-First**: Built-in health checks and analytics
2. **Performance Tracked**: Baseline monitoring and analytics
3. **SEO Optimized**: Full-stack SEO capabilities
4. **Type-Safe**: Full TypeScript and Laravel type checking
5. **Scalable**: Designed for growth with monitoring in mind

## 🏗️ Architecture Patterns

### 1. Model-View-Controller (MVC)

- **Models** (`app/Models/`): Data structures and database interactions
- **Views** (`resources/js/Pages/`): React components via Inertia.js
- **Controllers** (`app/Http/Controllers/`): Request handling

### 2. Service Layer Pattern

Business logic encapsulation:

```
Controller → Service → Model → Database
                ↓
        Analytics/Monitoring
```

### 3. Repository Pattern

Data access abstraction for flexibility and testability.

### 4. Event-Driven Architecture

Analytics and monitoring events trigger data collection.

### 5. Component-Driven Frontend

```
resources/js/
├── Components/       # Reusable UI components
├── Layouts/         # Page layouts
├── Pages/           # Full-page components
└── types/           # TypeScript definitions
```

## 🛠️ Technology Stack

### Backend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Laravel 12 | Application framework |
| **Language** | PHP 8.2+ | Server-side programming |
| **Database** | SQLite (default) | Lightweight data storage |
| **Cache** | File/Redis | Session and cache |
| **Monitoring** | Custom Dashboard | Health & analytics tracking |
| **Static Analysis** | PHPStan | Code quality |

### Frontend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | React 19 | UI library |
| **Language** | TypeScript 5.7 | Type-safe JavaScript |
| **Build Tool** | Vite 7 | Development & bundling |
| **Routing** | Inertia.js 2 | Full-stack SPA |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **UI Components** | Radix UI, Headless UI | Accessible primitives |

### Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Web Server** | Nginx | HTTP server |
| **Process Manager** | Supervisor (optional) | Background task management |
| **SSL** | Let's Encrypt | HTTPS support |

## 📚 Application Layers

### 1. Presentation Layer

**Responsibilities**: User interface, input handling, response formatting

**Components**:
- Inertia Pages (`resources/js/Pages/`)
- React Components (`resources/js/Components/`)
- Controllers (`app/Http/Controllers/`)

### 2. Application Layer

**Responsibilities**: Business logic and workflows

**Components**:
- Services (`app/Services/`)
- Form Requests (`app/Http/Requests/`)
- Middleware (`app/Http/Middleware/`)
- Analytics Events (`app/Events/`)

### 3. Domain Layer

**Responsibilities**: Core business entities

**Components**:
- Models (`app/Models/`)
- Contracts/Interfaces (`app/Contracts/`)

### 4. Infrastructure Layer

**Responsibilities**: Data persistence, monitoring, external services

**Components**:
- Database Migrations (`database/migrations/`)
- Seeders (`database/seeders/`)
- Monitoring Dashboard (`resources/views/monitoring/`)
- Configuration (`config/`)

## 🎯 Key Features

### Monitoring & Analytics

- **Health Checks**: API endpoint for system health monitoring
- **Request Tracking**: Analytics on user interactions
- **Payment Tracking**: Transaction monitoring and logging
- **Error Logging**: Centralized error tracking
- **Contact Tracking**: Message submission analytics

### API Endpoints

- `/api/messages` - User messaging system (authenticated)
- `/api/contact` - Contact form submission
- `/api/process-payment` - Payment processing
- `/api/health` - Health check endpoint

### SEO Features

- Server-side rendering for crawlers
- Dynamic meta tags
- Sitemap generation support
- Structured data support

## 🔄 Data Flow

### Standard Request Flow

```
1. Browser requests page
2. Nginx → PHP-FPM → Laravel Router
3. Controller receives request
4. Service layer processes business logic
5. Inertia returns page with data
6. React app renders on client
7. Analytics tracked throughout
```

### Monitoring Flow

```
Request → Analytics Event → Monitor Service → Database
              ↓
        Dashboard Display
```

## 🎨 Design Decisions

### Why SQLite by Default?

- Zero configuration for development
- Easily upgradeable to MySQL/PostgreSQL
- Suitable for small to medium applications
- No external database setup needed

### Why Service Layer?

- Encapsulates business logic
- Makes testing easier
- Enables code reuse
- Facilitates future changes

### Monitoring Architecture

- Built-in analytics from the start
- Enables data-driven decisions
- Performance baseline established early
- Health checks for production readiness

## 🔒 Security Architecture

### Authentication

- Shared auth-system integration
- Bearer token support for APIs
- Session-based web authentication

### Data Protection

- CSRF protection (Laravel middleware)
- SQL injection protection (Eloquent ORM)
- XSS protection (React auto-escape)
- Input validation on all forms

### Payment Security

- Rate limiting on payment endpoints
- Card data validation
- Secure payment processing

## 📊 Database Schema

### Core Tables

- **users**: User account information
- **messages**: User messages and notifications
- **contacts**: Contact form submissions
- **analytics**: Page views and user interactions
- **payments**: Transaction records

## 📝 Directory Structure

```
lunarblood/
├── app/
│   ├── Models/           # Database models
│   ├── Http/
│   │   ├── Controllers/  # Request handlers
│   │   └── Requests/     # Validation rules
│   ├── Services/         # Business logic
│   ├── Events/           # Analytics events
│   └── Providers/        # Service providers
├── routes/
│   ├── web.php           # Web routes
│   └── api.php           # API routes
├── resources/
│   └── js/
│       ├── Components/   # React components
│       ├── Layouts/      # Page layouts
│       ├── Pages/        # Full-page components
│       └── types/        # TypeScript types
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/          # Data seeders
├── storage/              # Uploads & cache
└── config/               # Configuration
```
