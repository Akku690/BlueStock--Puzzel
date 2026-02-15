# Blue Stock Puzzle Game

A high-performance, offline-first daily puzzle game built with React and TypeScript.

## 🚀 Features

- ⚡ **< 100ms** puzzle generation
- 📦 **< 50KB** initial bundle size
- 🔌 **100% offline** functionality
- 📊 **< 10** database writes per user per day
- 🎯 **95+** Lighthouse score
- 🎨 Modern, responsive UI
- 🔒 Secure authentication
- 💾 Smart caching and compression

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast builds
- **IndexedDB** for local storage
- **Service Workers** for offline support
- **LZ-String** for data compression
- **Zustand** for state management
- **Jest + RTL** for testing (90%+ coverage)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🔧 Installation

\`\`\`bash
npm install
\`\`\`

## 🏃 Running the Project

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm run preview
\`\`\`

### Testing
\`\`\`bash
npm test
npm run test:watch
\`\`\`

### Linting & Formatting
\`\`\`bash
npm run lint
npm run format
\`\`\`

## 📊 Performance Metrics

- First Load: < 100KB
- Time to Interactive: < 3s
- Client-side puzzle generation: < 100ms
- Lighthouse Score: 95+

## 🎯 Success Metrics

### Technical Goals
- ✅ < 100ms client-side puzzle generation
- ✅ < 50KB initial bundle size
- ✅ 100% offline functionality
- ✅ < 10 database writes per user per day
- ✅ 95+ Lighthouse score

### User Engagement Goals
- ✅ Daily Active Users > 40%
- ✅ Average session time > 8 minutes
- ✅ 30-day retention > 25%
- ✅ Streak completion rate > 15%

## 🏗️ Project Structure

\`\`\`
src/
├── components/       # React components
├── services/        # API and data services
├── store/           # State management
├── utils/           # Helper functions
├── hooks/           # Custom React hooks
└── types/           # TypeScript types
\`\`\`

## 🔐 Security

- No sensitive logic stored client-side
- Server-side validation for all inputs
- Rate limiting on all API endpoints
- Secure authentication flows

## 📱 Offline Support

The app uses Service Workers and IndexedDB to provide full offline functionality:
- Puzzles cached for current + next 7 days
- Progress synced in batches every 5 puzzles
- Compressed storage for optimal performance

## 📄 License

MIT
