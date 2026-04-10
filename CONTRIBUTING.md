# Contributing to LunarBlood

Thank you for your interest in contributing to LunarBlood! This document provides guidelines for contributions.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)

## 🤝 Code of Conduct

We are committed to providing a welcoming environment for all contributors.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other members

### Unacceptable Behavior
- Harassment or trolling
- Personal attacks
- Publishing others' private information
- Conduct that could be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+ with Composer
- Node.js 18+ with npm
- SQLite (default) or MySQL 8.0+
- Git

### Setup Development Environment

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR-USERNAME/lunarblood.git
cd lunarblood

# Add upstream remote
git remote add upstream https://github.com/JoshuaAckerly/lunarblood.git

# Install dependencies
composer install
npm install

# Set up environment
cp .env.example .env
php artisan key:generate

# Set up database
touch database/database.sqlite
php artisan migrate

# Start development
composer dev
```

## 🔄 Development Workflow

### 1. Create a Branch

```bash
# Feature
git checkout -b feat/add-monitoring-dashboard

# Bug fix
git checkout -b fix/payment-validation

# Documentation
git checkout -b docs/update-api-docs

# Tests
git checkout -b test/add-payment-tests
```

### 2. Make Changes and Commit

```bash
# Make edits and test locally
./vendor/bin/phpunit
npm test

# Create commits with clear messages
git commit -m "feat: add payment processing API"

# Keep updated
git fetch upstream
git rebase upstream/main
```

### 3. Test and Quality Checks

```bash
# Run tests
./vendor/bin/phpunit
npm test

# Check code quality
./vendor/bin/phpstan analyse
vendor/bin/pint
npm run lint
```

## 📝 Coding Standards

### PHP Standards

- Use **PSR-12** code style
- Type hint all parameters and returns
- Use meaningful names
- Keep functions focused

**Example**:
```php
<?php
namespace App\Services;

class PaymentService
{
    public function processPayment(array $cardData): array {
        // Validate card
        $this->validateCard($cardData);
        
        // Process payment
        return $this->charge($cardData);
    }
    
    private function validateCard(array $cardData): void {
        // Validation logic
    }
}
```

### TypeScript/JavaScript Standards

- Type all variables where possible
- Use ESLint configuration
- Use meaningful component names
- Keep components focused

**Example**:
```typescript
interface PaymentData {
    cardNumber: string;
    expiry: string;
    cvv: string;
}

export function PaymentForm(): JSX.Element {
    const handleSubmit = (data: PaymentData): void => {
        // Handle submission
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    );
}
```

## 📋 Commit Guidelines

Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Adding/updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvement

**Example**:
```
feat(payment): add payment processing with validation

Implement card payment processing with:
- Card validation
- Rate limiting
- Error handling
- Order ID generation

Closes #456
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Tests pass (`./vendor/bin/phpunit && npm test`)
- [ ] Code quality checks pass (`phpstan`, `eslint`)
- [ ] Code follows standards
- [ ] Documentation is updated
- [ ] Branch is up-to-date with upstream

### PR Title Format

```
feat: add payment processing API
fix: resolve message API authentication
docs: update testing guide
```

### PR Description

```markdown
## Description
What changes are you making?

## Motivation
Why are these changes needed?

## Types of Changes
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
How tested?

## Checklist
- [ ] Tests pass
- [ ] Code quality checks pass
- [ ] Documentation updated
```

## ✅ Testing Requirements

### Backend Tests

```bash
./vendor/bin/phpunit
./vendor/bin/phpunit --coverage-html coverage
```

Required:
- API endpoint tests
- Validation tests
- Edge case tests
- Error handling tests

### Frontend Tests

```bash
npm test
npm test -- --coverage
```

Required:
- Component tests
- Form validation tests
- Integration tests

## 🎯 Areas for Contribution

- **Feature Development**: New payment methods, analytics features
- **Bug Fixes**: Help fix reported issues
- **Tests**: Add missing test coverage
- **Documentation**: Improve guides and examples
- **Performance**: Optimize slow queries or rendering
- **Accessibility**: Improve component accessibility

## 📞 Getting Help

- Ask questions in pull requests
- Check existing documentation
- Open discussions for design decisions
- Reach out to maintainers

Thank you for contributing! 🎉
