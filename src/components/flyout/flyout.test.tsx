import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Flyout } from './flyout';
import { mockItemFull } from '@/test-utils/api-mock';
import { getItemsById } from '@/services/api';
import { downloadCSV } from '@/utils/download-csv';

vi.mock('@/services/api', () => ({
  getItemsById: vi.fn(),
}));

vi.mock('@/utils/download-csv', () => ({
  downloadCSV: vi.fn(),
}));

vi.mock('@/components/button/button', () => ({
  Button: ({
    text,
    onClick,
  }: {
    text: string;
    onClick: () => void;
    variant: string;
  }) => <button onClick={onClick}>{text}</button>,
}));

const createMockStore = (selectedItems: number[] = []) => {
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

    vi.mocked(getItemsById).mockResolvedValue([mockItemFull]);

    renderWithProvider([1, 2]);

    await user.click(screen.getByText('Downloading...'));

    await waitFor(() => {
      expect(getItemsById).toHaveBeenCalledWith([1, 2]);
      expect(downloadCSV).toHaveBeenCalledWith([mockItemFull]);
    });
  });

  it('does not download CSV file when API returns empty array', async () => {
    const user = userEvent.setup();
    vi.mocked(getItemsById).mockResolvedValue([]);
    renderWithProvider([1]);

    await user.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(downloadCSV).not.toHaveBeenCalled();
    });
  });

  it('prevents double download while in progress', async () => {
    const user = userEvent.setup();

    vi.mocked(getItemsById).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => {
            resolve([mockItemFull]);
          }, 1000),
        ),
    );

    renderWithProvider([1]);

    const downloadButton = screen.getByText('Downloading...');

    await user.click(downloadButton);
    await user.click(downloadButton);

    await waitFor(() => {
      expect(getItemsById).toHaveBeenCalledTimes(1);
    });
  });

  it('handles download error correcyly', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'error').mockReturnValue();

    vi.mocked(getItemsById).mockRejectedValue(new Error('Network error'));

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
});
