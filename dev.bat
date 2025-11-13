@echo off
echo Starting Lunar Blood Development Servers...
echo.
echo Backend: http://127.0.0.1:8003
echo Frontend: http://127.0.0.1:5176
echo.

start "Lunar Blood Backend" cmd /k "php artisan serve --port=8003"
timeout /t 2 /nobreak >nul
start "Lunar Blood Frontend" cmd /k "npm run dev"

echo Development servers started!
echo Press any key to exit...
pause >nul