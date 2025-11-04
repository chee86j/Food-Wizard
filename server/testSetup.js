// Server-side test setup file that works with ESM

// Export globals for ESM context
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
    headers: {},
    config: {},
  };
};

// Mock axios response helper
export const mockAxiosResponse = (data) => {
  return Promise.resolve(createMockResponse(data));
};

// Mock axios error helper
export const mockAxiosError = (message, status = 500) => {
  const error = new Error(message);
  error.response = createMockResponse(null, status, "Error");
  return Promise.reject(error);
};
