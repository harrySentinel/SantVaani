// Share utilities for Santvaani content
export interface ShareContent {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
}

export interface SaintShareData {
  name: string;
  nameHi: string;
  specialty: string;
  specialtyHi: string;
  description: string;
  descriptionHi: string;
  id: string;
}

// Generate formatted WhatsApp message for Saints
export function generateSaintWhatsAppMessage(saint: SaintShareData): string {
  const baseUrl = window.location.origin;
  const saintUrl = `${baseUrl}/saints#${saint.id}`;
  
  const message = `🕉️ *${saint.name}* ${saint.nameHi ? `(${saint.nameHi})` : ''}

"${saint.specialtyHi || saint.specialty}"

${saint.descriptionHi ? saint.descriptionHi.substring(0, 100) + '...' : saint.description.substring(0, 100) + '...'}

🔗 पूरी जीवन गाथा पढ़ें: ${saintUrl}

_Santvaani पर और भी संतों की कहानियां खोजें_ ✨
#Bhakti #${saint.name.replace(/\s+/g, '')} #Santvaani`;

  return encodeURIComponent(message);
}

// WhatsApp share for Saints
export function shareOnWhatsApp(whatsappMessage: string): void {
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;
  
  // Check if mobile device
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Try WhatsApp app first, fallback to web
    window.location.href = `whatsapp://send?text=${whatsappMessage}`;
    
    // Fallback to web WhatsApp after a short delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1000);
  } else {
    // Desktop - open WhatsApp Web
    window.open(whatsappUrl, '_blank');
  }
}

// Copy to clipboard with mobile fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers/mobile
      return fallbackCopyTextToClipboard(text);
    }
  } catch (err) {
    console.error('Copy failed:', err);
    return fallbackCopyTextToClipboard(text);
  }
}

// Fallback copy method for mobile/older browsers
function fallbackCopyTextToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}

// Native Share API (mobile devices)
export async function nativeShare(content: ShareContent): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: content.title,
        text: content.description,
        url: content.url,
      });
      return true;
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Native share failed:', err);
      }
      return false;
    }
  }
  return false;
}

// Twitter share
export function shareOnTwitter(content: ShareContent): void {
  const tweetText = `${content.title}\n\n${content.description}\n\n${content.url}`;
  const hashtags = content.hashtags?.join(',') || '';
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=${hashtags}`;
  window.open(twitterUrl, '_blank');
}

// Facebook share
export function shareOnFacebook(url: string): void {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank');
}

// Telegram share
export function shareOnTelegram(content: ShareContent): void {
  const message = `${content.title}\n\n${content.description}\n\n${content.url}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(message)}`;
  window.open(telegramUrl, '_blank');
}