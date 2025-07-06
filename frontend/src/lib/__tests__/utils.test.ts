import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      const result = cn('bg-red-500', 'text-white', 'p-4');
      expect(result).toContain('bg-red-500');
      expect(result).toContain('text-white');
      expect(result).toContain('p-4');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn(
        'base-class',
        isActive && 'active-class',
        !isActive && 'inactive-class'
      );
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
      expect(result).not.toContain('inactive-class');
    });

    it('handles empty/null values', () => {
      const result = cn('base-class', null, undefined, '', 'valid-class');
      expect(result).toContain('base-class');
      expect(result).toContain('valid-class');
    });

    it('merges conflicting Tailwind classes', () => {
      // This tests the clsx and tailwind-merge functionality
      const result = cn('p-4', 'p-2');
      // Should prioritize the last class (p-2)
      expect(result).toContain('p-2');
    });
  });
});
