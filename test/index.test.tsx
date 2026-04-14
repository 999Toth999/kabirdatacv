import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock react-dom/client
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({ render: mockRender }));

vi.mock('react-dom/client', () => ({
  default: { createRoot: mockCreateRoot },
  createRoot: mockCreateRoot,
}));

// Mock the App component
vi.mock('../App', () => ({
  default: () => null,
}));

describe('index.tsx entry point', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('renders the App into the root element', async () => {
    // Create a root element
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // Import index which triggers the side effect
    await import('../index');

    expect(mockCreateRoot).toHaveBeenCalledWith(root);
    expect(mockRender).toHaveBeenCalled();
  });

  it('throws an error if root element is missing', async () => {
    // Reset modules so index.tsx re-runs
    vi.resetModules();

    // Re-mock dependencies after reset
    vi.doMock('react-dom/client', () => ({
      default: { createRoot: mockCreateRoot },
      createRoot: mockCreateRoot,
    }));
    vi.doMock('../App', () => ({
      default: () => null,
    }));

    // Ensure no root element exists
    document.body.innerHTML = '';

    await expect(import('../index')).rejects.toThrow(
      'Could not find root element to mount to'
    );
  });
});
