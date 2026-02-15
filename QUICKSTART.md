# 🚀 Quick Start Guide

Welcome to **Blue Stock Puzzle**! This guide will help you get up and running in minutes.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** (optional, for version control)
- A code editor (VS Code recommended)

## ⚡ Automated Setup (Recommended)

### Windows
```bash
setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

The script will automatically:
1. ✅ Check Node.js version
2. 📦 Install dependencies
3. ⚙️ Create environment file
4. 🔍 Run linting
5. 🧪 Run tests
6. 🏗️ Build project

## 🔧 Manual Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- React 18 & React DOM
- TypeScript
- Vite (build tool)
- Zustand (state management)
- IndexedDB (idb)
- LZ-String (compression)
- Testing libraries
- Development tools

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:

```env
VITE_API_URL=https://api.yourdomain.com
```

**Note:** For local development, you can use a placeholder URL. The app works fully offline.

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🎯 Your First Puzzle

1. **Open the app** - Navigate to `http://localhost:3000`
2. **See today's puzzle** - A puzzle is generated instantly (< 100ms)
3. **Select an answer** - Click on one of the four options
4. **Submit** - Click the "Submit Answer" button
5. **Track your streak** - See your streak in the header

## 🛠️ Development Commands

### Run Development Server
```bash
npm run dev
```
- Hot module replacement
- Fast refresh
- Source maps

### Run Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

### Linting & Formatting
```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format
```

### Type Checking
```bash
npm run type-check
```

### Build for Production
```bash
npm run build
```

Output in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

### Analyze Bundle Size
```bash
npm run analyze
```

## 📂 Project Structure Overview

```
src/
├── components/       # React components
│   ├── Header        # Top bar with streak
│   ├── PuzzleGame    # Main puzzle interface
│   ├── Stats         # Statistics display
│   └── ...
├── services/         # API and external services
├── store/            # State management (Zustand)
├── utils/            # Helper functions
├── hooks/            # Custom React hooks
└── types/            # TypeScript types
```

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --primary: #1e40af;        /* Main color */
  --secondary: #3b82f6;      /* Secondary color */
  --success: #10b981;        /* Success state */
  --error: #ef4444;          /* Error state */
}
```

### Add New Puzzle Categories

Edit `src/utils/puzzle.ts`:

```typescript
const categories = [
  'Stock Market',
  'Finance',
  'Economics',
  'Trading',
  'Investment',
  'Your New Category',  // Add here
];
```

### Modify Puzzle Difficulty

Edit `src/utils/puzzle.ts`:

```typescript
const difficulties = ['easy', 'medium', 'hard'];
```

## 🧪 Testing Your Changes

### 1. Unit Tests

Test utility functions:

```typescript
// src/__tests__/puzzle.test.ts
describe('generatePuzzle', () => {
  it('generates puzzle quickly', () => {
    const start = performance.now();
    const puzzle = generatePuzzle('2024-01-01');
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100);
  });
});
```

### 2. Component Tests

Test React components:

```typescript
// src/__tests__/PuzzleGame.test.tsx
it('allows selecting an option', () => {
  render(<PuzzleGame />);
  const option = screen.getByText('Option A');
  fireEvent.click(option);
  
  expect(option).toHaveClass('selected');
});
```

### 3. Run Tests

```bash
npm test
```

Coverage report: `coverage/lcov-report/index.html`

## 🚀 Deployment

### Quick Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Build for Any Platform

```bash
npm run build
```

Deploy the `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📱 Testing Offline Mode

1. **Start the app** - `npm run dev`
2. **Open DevTools** - F12
3. **Go to Network tab**
4. **Select "Offline"** from throttling dropdown
5. **Reload the page** - App still works!

## 🔍 Debugging

### Browser DevTools

Open DevTools (F12) and check:

- **Console** - For errors and logs
- **Application > IndexedDB** - View stored data
- **Application > Service Workers** - Check SW status
- **Network** - Monitor API calls
- **Lighthouse** - Performance audit

### Common Issues

**Issue: App won't start**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Tests fail**
```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

**Issue: Build fails**
```bash
# Check TypeScript errors
npm run type-check
```

## 📊 Performance Monitoring

Check if you meet the targets:

```bash
# Bundle size (should be < 100KB)
npm run build
npm run analyze

# Test puzzle generation speed (should be < 100ms)
npm test -- puzzle.test.ts

# Lighthouse score (should be > 95)
# Run Lighthouse in Chrome DevTools
```

## 🎓 Learning Resources

### Understand the Architecture

Read [ARCHITECTURE.md](ARCHITECTURE.md) to learn about:
- Data flow
- State management
- Caching strategy
- Performance optimizations

### Contributing

Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Coding standards
- Git workflow
- PR guidelines

### Security

Review [SECURITY.md](SECURITY.md) for:
- Security best practices
- Vulnerability reporting
- Known considerations

## 💡 Tips & Tricks

### 1. Hot Reload
Change any file and see instant updates (no page refresh).

### 2. React DevTools
Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools) for debugging.

### 3. Redux DevTools
Use with Zustand for state debugging:
```typescript
import { devtools } from 'zustand/middleware';
```

### 4. Performance Profiling
Use Chrome DevTools Performance tab to profile your app.

### 5. Bundle Analysis
Run `npm run analyze` to visualize bundle composition.

## 🎯 Next Steps

Now that you're set up:

1. ✅ Explore the code
2. ✅ Make a small change
3. ✅ Run tests
4. ✅ Create a feature
5. ✅ Deploy your app

## 🤝 Get Help

- 📖 Read the [documentation](README.md)
- 🐛 [Report issues](https://github.com/username/repo/issues)
- 💬 Join discussions
- 📧 Contact support

## 🎉 You're Ready!

Congratulations! You now have a fully functional, production-ready puzzle game.

**Happy coding!** 🚀

---

**Need help?** Check [README.md](README.md) or open an issue.
