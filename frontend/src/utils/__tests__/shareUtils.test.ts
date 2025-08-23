import { describe, it, expect, vi } from 'vitest';
import { 
  shareToWhatsApp, 
  shareToTwitter, 
  shareToFacebook, 
  copyToClipboard,
  generateShareText 
} from '../shareUtils';

// Mock window.open
const mockOpen = vi.fn();
global.window = { ...global.window, open: mockOpen };

// Mock navigator.clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('shareUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateShareText', () => {
    it('should generate share text for saint', () => {
      const saint = {
        name: 'Test Saint',
        specialty: 'Devotion',
        description: 'A great devotee'
      };

      const result = generateShareText(saint, 'saint');
      
      expect(result).toContain('Test Saint');
      expect(result).toContain('Devotion');
      expect(result).toContain('SantVaani');
    });

    it('should generate share text for quote', () => {
      const quote = {
        text: 'Test quote',
        author: 'Test Author'
      };

      const result = generateShareText(quote, 'quote');
      
      expect(result).toContain('Test quote');
      expect(result).toContain('Test Author');
      expect(result).toContain('SantVaani');
    });
  });

  describe('shareToWhatsApp', () => {
    it('should open WhatsApp with correct URL', () => {
      shareToWhatsApp('Test message');
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/?text='),
        '_blank'
      );
    });
  });

  describe('shareToTwitter', () => {
    it('should open Twitter with correct URL', () => {
      shareToTwitter('Test message');
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://twitter.com/intent/tweet'),
        '_blank'
      );
    });
  });

  describe('shareToFacebook', () => {
    it('should open Facebook with correct URL', () => {
      const url = 'https://example.com';
      shareToFacebook('Test message', url);
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://www.facebook.com/sharer/sharer.php'),
        '_blank'
      );
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard', async () => {
      mockWriteText.mockResolvedValue(undefined);
      
      const result = await copyToClipboard('Test text');
      
      expect(mockWriteText).toHaveBeenCalledWith('Test text');
      expect(result).toBe(true);
    });

    it('should handle clipboard API failure', async () => {
      mockWriteText.mockRejectedValue(new Error('Clipboard error'));
      
      const result = await copyToClipboard('Test text');
      
      expect(result).toBe(false);
    });
  });
});