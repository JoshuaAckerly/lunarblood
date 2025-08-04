<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>404 - Page Not Found</title>
        <style>
            body {
                font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #0a0a0a;
                color: #fff;
            }
            .container {
                text-align: center;
                padding: 2rem;
            }
            h1 {
                font-size: 6rem;
                margin: 0;
                color: #666;
            }
            h2 {
                font-size: 2rem;
                margin: 1rem 0;
            }
            p {
                color: #999;
                max-width: 500px;
                margin: 0 auto 2rem;
            }
            a {
                display: inline-block;
                padding: 0.75rem 1.5rem;
                background: #fff;
                color: #000;
                text-decoration: none;
                border-radius: 0.5rem;
                font-weight: 500;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you're looking for has vanished into the darkness.</p>
            <a href="/">Go Home</a>
        </div>
    </body>
</html>