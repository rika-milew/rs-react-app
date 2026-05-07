import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Pagination } from './pagination';

describe('pagination component', () => {
  it('renders correct page information', () => {
    render(
      <Pagination
        page={0}
        totalPages={10}
        loading={false}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(screen.getByText(/page/i)).toHaveTextContent('Page 1 of 10');
  });

  it('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();

    render(
      <Pagination
        page={8}
        totalPages={10}
        loading={false}
        onPrev={vi.fn()}
        onNext={onNext}
      />
    );

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onPrev when prev button is clicked', async () => {
    const user = userEvent.setup();
    const onPrevious = vi.fn();

    render(
      <Pagination
        page={2}
        totalPages={5}
        loading={false}
        onPrev={onPrevious}
        onNext={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('disables Prev button on the first page', () => {
    render(
      <Pagination
        page={0}
        totalPages={10}
        loading={false}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('disables Next button on the last page', () => {
    render(
      <Pagination
        page={9}
        totalPages={10}
        loading={false}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
