import '@testing-library/jest-dom';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock do fetch
global.fetch = jest.fn();

// Mock do console para evitar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock do window.URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Mock do document.createElement
const mockLink = {
  click: jest.fn(),
  download: '',
  href: '',
  style: {},
};
global.document.createElement = jest.fn((tagName) => {
  if (tagName === 'a') {
    return mockLink;
  }
  return {};
});

// Mock do document.body
global.document.body = {
  appendChild: jest.fn(),
  removeChild: jest.fn(),
};
