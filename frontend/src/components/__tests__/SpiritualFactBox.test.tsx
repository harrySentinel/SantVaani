import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SpiritualFactBox from '../SpiritualFactBox';

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            {
              id: '1',
              text: 'Test spiritual fact',
              category: 'Test Category',
              icon: '🕉️',
              is_active: true
            }
          ],
          error: null
        }))
      }))
    }))
  }))
};

vi.mock('@/lib/supabaseClient', () => ({
  supabase: mockSupabase
}));

describe('SpiritualFactBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SpiritualFactBox />);
    expect(screen.getByText('Loading spiritual wisdom...')).toBeInTheDocument();
  });

  it('displays spiritual fact after loading', async () => {
    render(<SpiritualFactBox />);
    
    await waitFor(() => {
      expect(screen.getByText('Did You Know?')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Test spiritual fact')).toBeInTheDocument();
    });
  });

  it('displays category and icon', async () => {
    render(<SpiritualFactBox />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Category')).toBeInTheDocument();
      expect(screen.getByText('🕉️')).toBeInTheDocument();
    });
  });

  it('handles database error gracefully', async () => {
    // Mock error response
    mockSupabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({
            data: null,
            error: new Error('Database error')
          })
        })
      })
    });

    render(<SpiritualFactBox />);
    
    // Should fall back to mock data
    await waitFor(() => {
      expect(screen.getByText('Did You Know?')).toBeInTheDocument();
    });
  });

  it('renders progress indicators', async () => {
    render(<SpiritualFactBox />);
    
    await waitFor(() => {
      const indicators = screen.getByTestId ? screen.queryByTestId('progress-indicators') : null;
      // Progress indicators should be present in DOM
      expect(document.querySelector('.rounded-full')).toBeInTheDocument();
    });
  });
});