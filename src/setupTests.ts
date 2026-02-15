import '@testing-library/jest-dom';

// Mock service worker registration
declare global {
  interface Navigator {
    serviceWorker?: {
      register: jest.Mock<Promise<unknown>>;
    };
  }
}

global.navigator.serviceWorker = {
  register: jest.fn(() => Promise.resolve()),
};
