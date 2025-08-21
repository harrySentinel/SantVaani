/**
 * Cross-platform copy-to-clipboard utility with fallbacks
 * Supports both modern Clipboard API and legacy methods for maximum compatibility
 */

export interface CopyData {
  text: string;
  text_hi?: string;
  author: string;
  category?: string;
  source?: string;
}

export class CopyToClipboard {
  /**
   * Primary copy method using modern Clipboard API with fallback
   */
  static async copyText(text: string): Promise<boolean> {
    try {
      // Try modern Clipboard API first (works on HTTPS and modern browsers)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      // Fallback for older browsers or non-HTTPS contexts
      return this.legacyCopyText(text);
    } catch (error) {
      console.warn('Modern clipboard failed, trying legacy method:', error);
      return this.legacyCopyText(text);
    }
  }

  /**
   * Legacy copy method for older browsers
   */
  static legacyCopyText(text: string): boolean {
    try {
      // Create temporary textarea
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Style to make it invisible
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('tabindex', '-1');
      
      document.body.appendChild(textArea);
      
      // Select and copy
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch (error) {
      console.error('Legacy copy failed:', error);
      return false;
    }
  }

  /**
   * Format quote for sharing with beautiful formatting
   */
  static formatQuoteForSharing(quote: CopyData): string {
    const lines = [];
    
    // Add decorative header
    lines.push('✨ Sacred Wisdom from SantVaani ✨');
    lines.push('');
    
    // Add quote in English
    lines.push(`"${quote.text}"`);
    lines.push('');
    
    // Add Hindi translation if available
    if (quote.text_hi) {
      lines.push(`"${quote.text_hi}"`);
      lines.push('');
    }
    
    // Add author attribution
    lines.push(`— ${quote.author}`);
    
    // Add category if available
    if (quote.category) {
      lines.push(`Category: ${quote.category}`);
    }
    
    lines.push('');
    lines.push('🙏 Shared from SantVaani Digital Ashram');
    lines.push('Preserving and sharing timeless spiritual wisdom');
    
    return lines.join('\n');
  }

  /**
   * Format bhajan for sharing
   */
  static formatBhajanForSharing(bhajan: {
    title: string;
    title_hi: string;
    lyrics: string;
    lyrics_hi: string;
    meaning: string;
    author: string;
    category: string;
  }): string {
    const lines = [];
    
    // Add decorative header
    lines.push('🎵 Sacred Bhajan from SantVaani 🎵');
    lines.push('');
    
    // Title in both languages
    lines.push(bhajan.title);
    lines.push(bhajan.title_hi);
    lines.push('');
    
    // Category
    lines.push(`Category: ${bhajan.category}`);
    lines.push('');
    
    // Hindi lyrics
    lines.push('देवनागरी (Hindi):');
    lines.push(bhajan.lyrics_hi);
    lines.push('');
    
    // Transliteration
    lines.push('Transliteration:');
    lines.push(bhajan.lyrics);
    lines.push('');
    
    // Meaning
    lines.push('Meaning:');
    lines.push(bhajan.meaning);
    lines.push('');
    
    // Author
    lines.push(`— ${bhajan.author}`);
    lines.push('');
    
    lines.push('🙏 Shared from SantVaani Digital Ashram');
    lines.push('Experience divine melodies and sacred wisdom');
    
    return lines.join('\n');
  }

  /**
   * Quick copy method for quotes
   */
  static async copyQuote(quote: CopyData): Promise<boolean> {
    const formattedText = this.formatQuoteForSharing(quote);
    return await this.copyText(formattedText);
  }

  /**
   * Quick copy method for simple text with minimal formatting
   */
  static async copySimpleQuote(text: string, author: string): Promise<boolean> {
    const formattedText = `"${text}"\n\n— ${author}\n\n🙏 Shared from SantVaani Digital Ashram`;
    return await this.copyText(formattedText);
  }

  /**
   * Check if copying is supported on current device/browser
   */
  static isSupported(): boolean {
    return !!(
      navigator.clipboard || 
      document.queryCommandSupported?.('copy') ||
      document.execCommand
    );
  }

  /**
   * Get appropriate success message based on device
   */
  static getSuccessMessage(): string {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      return "📱 Copied! Ready to share via WhatsApp, SMS, or any app";
    } else {
      return "💻 Copied to clipboard! Ready to paste anywhere";
    }
  }

  /**
   * Get appropriate error message
   */
  static getErrorMessage(): string {
    return "Unable to copy automatically. Please select and copy the text manually.";
  }
}

export default CopyToClipboard;