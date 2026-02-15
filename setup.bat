@echo off
REM Blue Stock Puzzle - Quick Setup Script (Windows)
REM This script sets up the project and runs initial checks

echo.
echo Blue Stock Puzzle - Quick Setup
echo ==================================
echo.

REM Check Node.js installation
echo Checking Node.js version...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js 18 or higher from https://nodejs.org/
    exit /b 1
)
echo Node.js version: 
node -v
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)
echo Dependencies installed
echo.

REM Setup environment
echo Setting up environment...
if not exist .env (
    copy .env.example .env
    echo Created .env file from .env.example
    echo Please update .env with your API URL
) else (
    echo .env file already exists
)
echo.

REM Run linting
echo Running linting checks...
call npm run lint
if errorlevel 1 (
    echo ERROR: Linting failed
    exit /b 1
)
echo Linting passed
echo.

REM Run tests
echo Running test suite...
call npm test -- --coverage --silent
if errorlevel 1 (
    echo ERROR: Tests failed
    exit /b 1
)
echo Tests passed
echo.

REM Build project
echo Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    exit /b 1
)
echo Build completed
echo.

REM Summary
echo ==================================
echo Setup complete!
echo.
echo Next steps:
echo    1. Update .env with your API URL
echo    2. Run 'npm run dev' to start development server
echo    3. Run 'npm test' to run tests
echo    4. Run 'npm run build' to build for production
echo.
echo Documentation:
echo    - README.md - Getting started
echo    - ARCHITECTURE.md - Technical details
echo    - DEPLOYMENT.md - Deployment guide
echo.
echo Ready to start developing!
echo ==================================
echo.
pause
