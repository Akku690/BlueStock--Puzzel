import '@testing-library/jest-dom';

// Mock service worker registration
global.navigator.serviceWorker = {
  register: jest.fn(() => Promise.resolve()),
} as any;
