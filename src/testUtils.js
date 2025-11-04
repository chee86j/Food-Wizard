// Globals for Jest tests
import "@testing-library/jest-dom";

// Re-export Jest globals to fix linting issues
export const describe = global.describe;
export const test = global.test;
export const it = global.it;
export const expect = global.expect;
export const beforeEach = global.beforeEach;
export const afterEach = global.afterEach;
export const beforeAll = global.beforeAll;
export const afterAll = global.afterAll;
export const jest = global.jest;

// Helper function to create mock responses
export const createMockResponse = (data, status = 200, statusText = "OK") => {
  return {
    data,
    status,
    statusText,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(data),
  };
};

// Helper function to simulate fetch API responses
export const mockFetchResponse = (data, options = {}) => {
  const { ok = true, status = 200 } = options;
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
};

// Mock the global fetch for testing
export const setupFetchMock = (implementation) => {
  global.fetch = jest.fn(implementation);
};

// Reset all mocks after each test
export const resetMocks = () => {
  if (global.fetch && global.fetch.mockClear) {
    global.fetch.mockClear();
  }
  if (jest && jest.clearAllMocks) {
    jest.clearAllMocks();
  }
};
