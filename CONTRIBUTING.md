# Contributing to Blue Stock Puzzle

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the best outcome for the project

## Getting Started

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/blue-stock-puzzle.git
   cd blue-stock-puzzle
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Before Making Changes

1. **Update your local repository**
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Making Changes

1. **Write code** following the project's coding standards

2. **Add tests** for new functionality
   - Maintain 90%+ coverage
   - Test happy paths and edge cases
   - Mock external dependencies

3. **Run linting**
   ```bash
   npm run lint
   npm run format
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Test performance**
   - Puzzle generation < 100ms
   - Bundle size < 50KB
   - Lighthouse score > 95

### Committing Changes

Use conventional commit messages:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
git commit -m "feat(puzzle): add hint system"
git commit -m "fix(cache): resolve compression issue"
git commit -m "docs(readme): update installation steps"
git commit -m "perf(generation): optimize puzzle algorithm"
```

### Submitting Changes

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure CI passes

3. **Address feedback**
   - Respond to review comments
   - Make requested changes
   - Keep PR focused and small

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all data structures
- Avoid `any` type
- Use proper typing for functions

```typescript
// Good
interface User {
  id: string;
  name: string;
}

const getUser = (id: string): Promise<User> => {
  // implementation
};

// Bad
const getUser = (id: any): any => {
  // implementation
};
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
```

### Performance

- Memoize expensive computations
- Use React.memo for pure components
- Implement code splitting for large features
- Monitor bundle size impact

```typescript
// Memoization example
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  return <div>{processedData}</div>;
});
```

### Testing

- Write tests for all new features
- Test user interactions, not implementation
- Use meaningful test descriptions
- Mock external dependencies

```typescript
describe('PuzzleGame', () => {
  it('should submit answer when button clicked', async () => {
    render(<PuzzleGame />);
    
    const option = screen.getByText('Option A');
    fireEvent.click(option);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
```

## Performance Requirements

All contributions must meet these performance targets:

- **Puzzle Generation**: < 100ms
- **Bundle Size**: < 50KB (initial load)
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 95
- **Test Coverage**: > 90%

Test performance impact:

```bash
# Bundle size
npm run build
npm run analyze

# Test performance
npm test -- puzzle.test.ts
```

## Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for architectural changes
- Add JSDoc comments for complex functions
- Include examples in documentation

```typescript
/**
 * Generate a puzzle for the specified date
 * @param date - Date string in YYYY-MM-DD format
 * @returns Generated puzzle object
 * @throws Error if date format is invalid
 * 
 * @example
 * const puzzle = generatePuzzle('2024-01-01');
 */
export const generatePuzzle = (date: string): Puzzle => {
  // implementation
};
```

## Review Process

### What Reviewers Look For

1. **Code Quality**
   - Clean, readable code
   - Proper error handling
   - No console.logs in production code

2. **Testing**
   - Adequate test coverage
   - Tests actually test the feature
   - No flaky tests

3. **Performance**
   - No performance regressions
   - Bundle size impact minimal
   - Efficient algorithms

4. **Documentation**
   - Code is self-documenting
   - Complex logic explained
   - README updated if needed

### Addressing Review Comments

- Respond to all comments
- Ask questions if unclear
- Make changes in new commits
- Don't force push unless requested

## Issue Reporting

### Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser/OS information
- Console errors

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative solutions considered
- Impact on existing features

## Questions?

- Open a discussion on GitHub
- Check existing issues and PRs
- Review documentation

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited for their contributions

Thank you for contributing to Blue Stock Puzzle! 🎉
