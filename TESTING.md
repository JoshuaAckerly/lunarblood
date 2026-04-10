# Testing Guide - LunarBlood

Comprehensive guide to testing the LunarBlood application.

## 📋 Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [Best Practices](#best-practices)

## 🎯 Testing Philosophy

1. **Test Behavior, Not Implementation**: Focus on what code does
2. **Arrange-Act-Assert (AAA)**: Clear test structure
3. **Test Isolation**: Each test is independent
4. **Meaningful Names**: Descriptive test names
5. **Fast Tests**: Keep tests quick to run
6. **Real-World Scenarios**: Test realistic use cases

## 🔬 Test Types

### 1. Unit Tests

Test individual classes in isolation.

**Location**: `tests/Unit/`

**Example**:
```php
<?php
namespace Tests\Unit;

use App\Services\PaymentService;
use Tests\TestCase;

class PaymentServiceTest extends TestCase
{
    public function test_payment_validation(): void
    {
        $service = new PaymentService();
        $result = $service->validateCard('4111111111111111');
        
        $this->assertTrue($result);
    }
}
```

### 2. Feature Tests

Test complete features and API endpoints.

**Location**: `tests/Feature/`

**Example**:
```php
<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_payment_endpoint_requires_valid_input(): void
    {
        $response = $this->post('/api/process-payment', [
            'email' => 'invalid-email',
            'cardNumber' => '123',  // Invalid
        ]);

        $response->assertStatus(400);
        $response->assertJsonPath('success', false);
    }

    public function test_payment_endpoint_rate_limited(): void
    {
        // Make 6 requests (limit is 5 per minute)
        for ($i = 0; $i < 6; $i++) {
            $this->post('/api/process-payment', [
                'email' => 'user@example.com',
                'firstName' => 'John',
                'lastName' => 'Doe',
                'address' => '123 Main St',
                'city' => 'Springfield',
                'state' => 'IL',
                'zip' => '62701',
                'cardNumber' => '4111111111111111',
                'expiry' => '12/25',
                'cvv' => '123',
            ]);
        }

        $response = $this->post('/api/process-payment', [...]);
        $response->assertStatus(429);
    }
}
```

### 3. API Tests

Test API endpoints and responses.

**Example**:
```php
<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_messages_endpoint_requires_auth(): void
    {
        $response = $this->get('/api/messages');
        $response->assertStatus(401);
    }

    public function test_messages_endpoint_with_auth(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer valid-token')
            ->get('/api/messages');
        
        $response->assertStatus(200);
        $response->assertJsonIsArray();
    }
}
```

## 🏃 Running Tests

### PHPUnit (Backend)

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit tests/Unit
./vendor/bin/phpunit tests/Feature

# Run specific test file
./vendor/bin/phpunit tests/Feature/PaymentApiTest.php

# Run specific test method
./vendor/bin/phpunit --filter test_payment_validation

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage

# Stop on first failure
./vendor/bin/phpunit --stop-on-failure
```

### Jest (Frontend)

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- PaymentForm

# Generate coverage report
npm test -- --coverage
```

## ✍️ Writing Tests

### Test Naming

Use descriptive names:

```php
// Good
test_payment_processing_validates_card_expiry()
test_message_api_returns_unauthorized_without_token()

// Bad
test_payment()
test_messages()
```

### AAA Pattern

```php
public function test_example(): void
{
    // Arrange
    $validCardData = [
        'cardNumber' => '4111111111111111',
        'expiry' => '12/25',
        'cvv' => '123',
    ];
    
    // Act
    $isValid = $service->validateCard($validCardData['cardNumber']);
    
    // Assert
    $this->assertTrue($isValid);
}
```

## 📊 Test Coverage

Check test coverage:

```bash
# Generate coverage
./vendor/bin/phpunit --coverage-text

# Generate HTML coverage report
./vendor/bin/phpunit --coverage-html coverage
```

Target coverage:
- Services: 90%+
- API Controllers: 85%+
- Models: 75%+

## 🎯 Best Practices

1. **Test API contracts** - verify request/response formats
2. **Test rate limiting** - ensure limits work correctly
3. **Test validation** - cover all validation rules
4. **Test edge cases** - empty data, boundary conditions
5. **Use fixtures** - consistent test data
6. **Mock external services** - don't call real payment gateways
7. **Test error paths** - not just happy paths
8. **Isolate tests** - no test interdependencies

## 📚 Resources

- [PHPUnit Documentation](https://phpunit.de/)
- [Jest Documentation](https://jestjs.io/)
- [Laravel Testing](https://laravel.com/docs/testing)
