import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Flyout } from './flyout';
import { mockItemFull } from '@/test-utils/api-mock';
import { downloadCSV } from '@/utils/download-csv';
import type { EnhancedStore } from '@reduxjs/toolkit';

const mockUnwrap = vi.fn();
const mockDownloadItems = vi.fn(() => ({
  unwrap: mockUnwrap,
}));

let mockIsLoading = false;

vi.mock('@/store/api/api-endpoints', () => ({
  useDownloadMutation: () => [mockDownloadItems, { isLoading: mockIsLoading }],
}));

vi.mock('@/utils/download-csv', () => ({
  downloadCSV: vi.fn(),
}));

vi.mock('@/components/button/button', () => ({
  Button: ({
    text,
    onClick,
    disabled,
  }: {
    text: string;
    onClick: () => void;
    variant: string;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  ),
}));

type MockRootState = {
  selectedItems: {
    selectedItems: number[];
  };
};

const createMockStore = (
  selectedItems: number[] = [],
): EnhancedStore<MockRootState> => {
  return configureStore({
    reducer: {
      selectedItems: () => ({
        selectedItems,
      }),
    },
  });
};

const renderWithProvider = (selectedItems: number[] = []) => {
  const store = createMockStore(selectedItems);
  return {
    ...render(
      <Provider store={store}>
        <Flyout />
      </Provider>,
    ),
    store,
  };
};
describe('flyout component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDownloadItems.mockReturnValue({
      unwrap: mockUnwrap,
    });
  });

  it('is not visible when no items are selected', () => {
    const { container } = renderWithProvider([]);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders buttons when items are selected', () => {
    renderWithProvider([1, 2]);

    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('displays correct number of selected items', () => {
    renderWithProvider([1, 2, 100]);

    expect(screen.getByText(/selected items/i)).toBeInTheDocument();
    expect(screen.getByText(/3 items/i)).toBeInTheDocument();
  });

  it('displays item instead of items for one selected item', () => {
    renderWithProvider([1]);
    expect(screen.getByText(/1 item/i)).toBeInTheDocument();
  });

  it('downloads CSV file with selected items', async () => {
    const user = userEvent.setup();

    mockUnwrap.mockResolvedValue([mockItemFull]);

    renderWithProvider([1, 2]);

    await user.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(mockDownloadItems).toHaveBeenCalledWith([1, 2]);
      expect(downloadCSV).toHaveBeenCalledWith([mockItemFull]);
    });
  });

  it('does not download CSV file when API returns empty array', async () => {
    const user = userEvent.setup();

    mockUnwrap.mockResolvedValue([]);
    renderWithProvider([1]);

    await user.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(downloadCSV).not.toHaveBeenCalled();
    });
  });

  it('handles download error correcyly', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'error').mockReturnValue();

    mockUnwrap.mockRejectedValue(new Error('Network error'));

    renderWithProvider([1]);

    await user.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to download CSV:',
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it('shows downloading text on button when download is in progress', () => {
    mockIsLoading = true;

    renderWithProvider([1, 2]);

    const downloadButton = screen.getByText('Downloading...');
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toBeDisabled();
  });

  it('prevents multiple downloads', async () => {
    const user = userEvent.setup();
    mockIsLoading = true;

    renderWithProvider([1, 2]);

    const downloadButton = screen.getByText('Downloading...');
    await user.click(downloadButton);

    expect(mockDownloadItems).not.toHaveBeenCalled();
  });
});
