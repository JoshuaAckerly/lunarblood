<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    #[Test]
    public function it_loads_the_homepage(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }
}
