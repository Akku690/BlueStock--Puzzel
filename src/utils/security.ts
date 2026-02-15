/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate puzzle answer input
 */
export const validateAnswerInput = (
  answer: number,
  totalOptions: number
): boolean => {
  return (
    Number.isInteger(answer) &&
    answer >= 0 &&
    answer < totalOptions
  );
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number, timeWindow: number) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  getRemainingTime(): number {
    if (this.requests.length < this.maxRequests) {
      return 0;
    }

    const oldestRequest = Math.min(...this.requests);
    const timeUntilReset = this.timeWindow - (Date.now() - oldestRequest);
    return Math.max(0, timeUntilReset);
  }

  reset(): void {
    this.requests = [];
  }
}

/**
 * CSRF token generation
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Secure session storage
 */
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      // In production, consider encrypting sensitive data
      sessionStorage.setItem(key, value);
    } catch (error) {
      // Session storage write failed silently
    }
  },

  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },

  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      // Session storage removal failed silently
    }
  },

  clear: (): void => {
    try {
      sessionStorage.clear();
    } catch (error) {
      // Session storage clear failed silently
    }
  },
};

/**
 * Content Security Policy validator
 */
export const validateCSP = (): boolean => {
  const metaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  return metaTag !== null;
};

/**
 * Check if running in secure context (HTTPS)
 */
export const isSecureContext = (): boolean => {
  return window.isSecureContext;
};

/**
 * Input sanitization for puzzle data
 */
export const sanitizePuzzleData = (data: unknown): unknown => {
  if (typeof data === 'string') {
    return sanitizeInput(data);
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizePuzzleData(item));
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const key of Object.keys(data)) {
      sanitized[key] = sanitizePuzzleData((data as Record<string, unknown>)[key]);
    }
    return sanitized;
  }

  return data;
};
