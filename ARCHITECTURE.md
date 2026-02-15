# Blue Stock Puzzle - Development Guide

## Architecture Overview

### Client-Side Architecture

```
src/
├── components/        # React UI components
│   ├── Header         # Top navigation with streak indicator
│   ├── PuzzleGame     # Main puzzle game component
│   ├── Stats          # User statistics display
│   ├── Loading        # Loading state component
│   └── ErrorBoundary  # Error handling wrapper
├── services/          # API and external services
│   └── api.ts         # Rate-limited API client with batching
├── store/             # State management (Zustand)
│   └── gameStore.ts   # Global game state
├── utils/             # Utility functions
│   ├── db.ts          # IndexedDB wrapper
│   ├── compression.ts # LZ-String compression helpers
│   ├── puzzle.ts      # Puzzle generation and validation
│   └── registerSW.ts  # Service Worker registration
└── types/             # TypeScript type definitions
```

## Performance Optimizations

### 1. Client-Side Puzzle Generation (< 100ms)
- Deterministic seeded random generation
- No API calls required for puzzle generation
- Cached in IndexedDB for offline access

### 2. Bundle Size Optimization (< 50KB)
- Code splitting with manual chunks
- Tree shaking enabled
- Terser minification with console removal
- Brotli and Gzip compression

### 3. Offline Functionality (100%)
- Service Worker with workbox
- IndexedDB for data persistence
- Automatic sync queue for failed requests
- 7-day puzzle preloading

### 4. Database Write Optimization (< 10 writes/day)
- Batch updates every 5 puzzles
- Write coalescing for stats
- Sync queue for offline operations
- Cleanup of old data (30 days)

## Data Flow

### Puzzle Loading
1. Check IndexedDB cache
2. Generate puzzle if not cached (< 100ms)
3. Load user progress from IndexedDB
4. Preload next 7 days in background

### Answer Submission
1. Validate answer locally
2. Save progress to IndexedDB immediately
3. Add to batch queue
4. Sync batch when:
   - 5 puzzles completed, OR
   - User goes online, OR
   - Explicit sync requested

### Statistics Updates
1. Calculate stats from local progress data
2. Save to IndexedDB
3. Sync to server with debouncing
4. Add to sync queue if offline

## Caching Strategy

### Compression
- Compress data > 1KB using LZ-String
- UTF-16 encoding for efficient storage
- Automatic decompression on read

### Cache Duration
- Puzzles: 30 days
- Progress: 30 days
- Stats: No expiration (always keep latest)
- API responses: 24 hours

### Storage Limits
- Monitor localStorage usage
- Automatic cleanup when quota exceeded
- Prioritize recent data

## API Rate Limiting

### Implementation
- 1 request per second limit
- Request queue with FIFO processing
- Automatic retry with exponential backoff
- Max 3 retries before marking as failed

### Batch Operations
- Progress: Batch of 5 updates
- Stats: Debounced updates
- Sync queue: Process on network reconnect

## Testing Strategy

### Unit Tests (Jest)
- Utility functions
- Puzzle generation
- Compression
- Data validation

### Component Tests (RTL)
- User interactions
- State updates
- Error handling
- Loading states

### Coverage Requirements
- Branches: 90%+
- Functions: 90%+
- Lines: 90%+
- Statements: 90%+

## Build Process

### Development
```bash
npm run dev
```
- Vite dev server
- Hot module replacement
- Source maps enabled

### Production
```bash
npm run build
```
- Minification and tree-shaking
- Code splitting
- Asset optimization
- Service worker generation

### Analysis
```bash
npm run analyze
```
- Bundle size visualization
- Dependency analysis
- Performance metrics

## Security Considerations

### Client-Side
- No sensitive logic in client code
- Input validation for all user data
- XSS protection via React
- CSP headers recommended

### API Communication
- HTTPS only
- Rate limiting
- CORS configuration
- Authentication tokens in cookies

## Monitoring

### Performance Metrics
- Puzzle generation time
- Bundle size
- Page load time
- Time to Interactive (TTI)
- Lighthouse score

### User Engagement
- Daily Active Users (DAU)
- Session duration
- Puzzle completion rate
- Streak retention

## Deployment

### Environment Variables
- `VITE_API_URL`: API base URL

### Build Output
- `dist/`: Production build
- `dist/assets/`: Bundled JS/CSS
- `dist/sw.js`: Service worker

### CDN Recommendations
- Enable Brotli compression
- Set cache headers
- Enable HTTP/2

## Troubleshooting

### Bundle Size Too Large
1. Check bundle analyzer output
2. Review dynamic imports
3. Optimize dependencies
4. Enable compression

### Slow Puzzle Generation
1. Profile generation function
2. Optimize random generation
3. Cache more aggressively
4. Reduce puzzle complexity

### Offline Sync Issues
1. Check IndexedDB status
2. Verify service worker registration
3. Review sync queue
4. Check network connectivity

### Low Test Coverage
1. Add missing test cases
2. Test error paths
3. Test edge cases
4. Mock external dependencies
