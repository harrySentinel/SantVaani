// Bhajan specific share utilities
export interface BhajanShareData {
  id: string;
  title: string;
  title_hi: string;
  category: string;
  lyrics: string;
  lyrics_hi: string;
  author: string;
  meaning: string;
}

// Generate formatted WhatsApp message for Bhajans
export function generateBhajanWhatsAppMessage(bhajan: BhajanShareData): string {
  const baseUrl = window.location.origin;
  const bhajanUrl = `${baseUrl}/bhajans#${bhajan.id}`;
  
  // Take first few lines of lyrics for preview
  const lyricsPreview = bhajan.lyrics_hi.split('\n').slice(0, 3).join('\n');
  
  const message = `🎵 *${bhajan.title}* ${bhajan.title_hi ? `(${bhajan.title_hi})` : ''}

🙏 *श्रेणी*: ${bhajan.category}
✍️ *रचयिता*: ${bhajan.author}

*भजन के कुछ पंक्तियाँ*:
${lyricsPreview}...

*अर्थ*: ${bhajan.meaning.substring(0, 80)}...

🔗 पूरे भजन और अर्थ के लिए: ${bhajanUrl}

_SantVaani पर आध्यात्मिक भजनों का आनंद लें_ 🎼
#Bhajan #${bhajan.title.replace(/\s+/g, '')} #SantVaani #Devotion`;

  return encodeURIComponent(message);
}