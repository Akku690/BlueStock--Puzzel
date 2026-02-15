# Deployment Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Blue stock project"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your API URL.

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Build output**
   - Files generated in `dist/` directory
   - Service worker at `dist/sw.js`
   - Compressed assets (`.gz` and `.br`)

## Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm test -- --coverage
```

## Linting and Formatting

### Lint code
```bash
npm run lint
```

### Fix linting issues
```bash
npm run lint:fix
```

### Format code
```bash
npm run format
```

## Performance Optimization

### Analyze bundle size
```bash
npm run analyze
```

This generates a visual report of your bundle composition.

### Performance Checklist
- [ ] Bundle size < 50KB (gzipped)
- [ ] First load < 100KB
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 95
- [ ] Puzzle generation < 100ms

## Deployment Platforms

### Vercel

1. Install Vercel CLI
   ```bash
   npm i -g vercel
   ```

2. Deploy
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard

### Netlify

1. Install Netlify CLI
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy
   ```bash
   netlify deploy --prod
   ```

3. Configure `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### GitHub Pages

1. Install gh-pages
   ```bash
   npm i -D gh-pages
   ```

2. Add to package.json scripts:
   ```json
   {
     "deploy": "gh-pages -d dist"
   }
   ```

3. Update `vite.config.ts` with base:
   ```typescript
   export default defineConfig({
     base: '/repository-name/',
     // ... rest of config
   })
   ```

4. Deploy
   ```bash
   npm run build
   npm run deploy
   ```

### Docker

1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Create `nginx.conf`:
   ```nginx
   server {
     listen 80;
     location / {
       root /usr/share/nginx/html;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
     
     gzip on;
     gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

3. Build and run:
   ```bash
   docker build -t bluestock-puzzle .
   docker run -p 8080:80 bluestock-puzzle
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

## Monitoring

### Lighthouse CI

Add to your CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
          uploadArtifacts: true
```

### Error Tracking

Integrate error tracking service (e.g., Sentry):

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
```

## Troubleshooting

### Build Failures

**Issue**: Out of memory
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**Issue**: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Service Worker Issues

**Issue**: SW not updating
```bash
# Hard refresh in browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

**Issue**: SW not registering
- Check HTTPS (required for SW)
- Verify `sw.js` in dist folder
- Check browser console for errors

### Performance Issues

**Issue**: Large bundle size
```bash
# Analyze bundle
npm run analyze

# Check for large dependencies
npm ls --depth=0
```

**Issue**: Slow puzzle generation
- Profile with Chrome DevTools
- Check algorithm complexity
- Verify caching is working

## Post-Deployment Checklist

- [ ] All tests passing
- [ ] Linting clean
- [ ] Bundle size within limits
- [ ] Service worker registered
- [ ] Offline functionality works
- [ ] Lighthouse score > 95
- [ ] Error tracking configured
- [ ] Environment variables set
- [ ] SSL certificate valid
- [ ] CDN configured
- [ ] Monitoring active
