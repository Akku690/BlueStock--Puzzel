#!/bin/bash

# Blue Stock Puzzle - Quick Setup Script
# This script sets up the project and runs initial checks

set -e  # Exit on error

echo "🔵 Blue Stock Puzzle - Quick Setup"
echo "=================================="
echo ""

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Setup environment
echo "⚙️  Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "   Please update .env with your API URL"
else
    echo "✅ .env file already exists"
fi
echo ""

# Run linting
echo "🔍 Running linting checks..."
npm run lint
echo "✅ Linting passed"
echo ""

# Run tests
echo "🧪 Running test suite..."
npm test -- --coverage --silent
echo "✅ Tests passed"
echo ""

# Build project
echo "🏗️  Building project..."
npm run build
echo "✅ Build completed"
echo ""

# Check bundle size
echo "📊 Checking bundle size..."
bundle_size=$(du -sk dist | cut -f1)
echo "   Bundle size: ${bundle_size}KB"
if [ "$bundle_size" -gt 100 ]; then
    echo "⚠️  Warning: Bundle size exceeds 100KB"
else
    echo "✅ Bundle size is optimal"
fi
echo ""

# Summary
echo "=================================="
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Update .env with your API URL"
echo "   2. Run 'npm run dev' to start development server"
echo "   3. Run 'npm test' to run tests"
echo "   4. Run 'npm run build' to build for production"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Getting started"
echo "   - ARCHITECTURE.md - Technical details"
echo "   - DEPLOYMENT.md - Deployment guide"
echo ""
echo "🚀 Ready to start developing!"
echo "=================================="
