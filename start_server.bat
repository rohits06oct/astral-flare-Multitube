@echo off
setlocal
echo ==========================================
echo    MultiTube Local Server Starter
echo ==========================================
echo.

:: Try Node.js first (serve is very reliable)
where npx >nul 2>nul
if %errorlevel%==0 (
    echo [1/2] Attempting to start with Node.js (npx serve)...
    npx -y serve . -p 8000
    goto end
)

:: Try Python next || python -m http.server 8000
where python >nul 2>nul
if %errorlevel%==0 (
    echo [2/2] Node.js not found. Starting with Python...
    echo.
    echo 🚀 App will be available at: http://localhost:8000
    start http://localhost:8000
    python -m http.server 8000
    goto end
)

echo ❌ ERROR: Neither Node.js nor Python was detected.
echo.
echo Please install one of them to run this app properly:
echo 1. Node.js: https://nodejs.org/
echo 2. Python:  https://www.python.org/
echo.
echo Press any key to exit...
pause >nul

:end
pause
