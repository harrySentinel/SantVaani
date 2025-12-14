import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, LoadingPage, LoadingSkeleton } from '../loading-spinner';

describe('LoadingSpinner', () => {
  it('renders spinner with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('🕉️')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Loading sacred content..." />);
    expect(screen.getByText('Loading sacred content...')).toBeInTheDocument();
    expect(screen.getByText('🕉️')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('.w-12.h-12');
    expect(spinner).toBeInTheDocument();
  });
});

describe('LoadingPage', () => {
  it('renders full page loading with spiritual message', () => {
    render(<LoadingPage text="Loading Santvaani..." />);
    expect(screen.getByText('Loading Santvaani...')).toBeInTheDocument();
    expect(screen.getByText('धैर्य रखें... Please wait')).toBeInTheDocument();
  });
});

describe('LoadingSkeleton', () => {
  it('renders skeleton with animation', () => {
    const { container } = render(<LoadingSkeleton className="h-4 w-full" />);
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });
});
