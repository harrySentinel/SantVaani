import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

describe('App Loading Components', () => {
  it('renders loading spinner correctly', () => {
    render(<LoadingSpinner text="Loading SantVaani..." />);
    
    expect(screen.getByText('🕉️')).toBeInTheDocument();
    expect(screen.getByText('Loading SantVaani...')).toBeInTheDocument();
  });

  it('shows spiritual Om symbol in loading state', () => {
    render(<LoadingSpinner />);
    
    const omSymbol = screen.getByText('🕉️');
    expect(omSymbol).toBeInTheDocument();
  });
});
