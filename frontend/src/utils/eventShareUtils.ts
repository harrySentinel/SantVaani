// Event specific share utilities
export interface EventShareData {
  id: string | number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  organizer: string;
  type: string;
  invitationMessage?: string;
  invitation_message?: string;
}

function getEventTypeEmoji(type: string): string {
  switch (type) {
    case 'bhagwad-katha': return '📿';
    case 'bhandara': return '🍽️';
    case 'kirtan': return '🎵';
    case 'satsang': return '🕉️';
    default: return '🙏';
  }
}

function getEventTypeLabel(type: string): string {
  switch (type) {
    case 'bhagwad-katha': return 'श्रीमद भागवत कथा';
    case 'bhandara': return 'भंडारा';
    case 'kirtan': return 'कीर्तन';
    case 'satsang': return 'सत्संग';
    default: return type.replace('-', ' ');
  }
}

function getEventTypeHashtag(type: string): string {
  switch (type) {
    case 'bhagwad-katha': return '#BhagwadKatha';
    case 'bhandara': return '#Bhandara';
    case 'kirtan': return '#Kirtan';
    case 'satsang': return '#Satsang';
    default: return '#SpiritualEvent';
  }
}

// Generate formatted WhatsApp message for Events
export function generateEventWhatsAppMessage(event: EventShareData): string {
  const baseUrl = window.location.origin;
  const eventUrl = `${baseUrl}/events#${event.id}`;

  const emoji = getEventTypeEmoji(event.type);
  const typeLabel = getEventTypeLabel(event.type);
  const typeHashtag = getEventTypeHashtag(event.type);

  // Format date in Hindi locale
  const formattedDate = new Date(event.date).toLocaleDateString('hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Invitation preview (first 150 chars)
  const invitation = event.invitation_message || event.invitationMessage || '';
  const invitationPreview = invitation
    ? `\n\n💌 ${invitation.substring(0, 150)}${invitation.length > 150 ? '...' : ''}`
    : '';

  const message = `${emoji} *${event.title}*
_${typeLabel}_

📅 ${formattedDate}
🕐 ${event.time}
📍 ${event.location}, ${event.city}${invitationPreview}

👤 Organized by: ${event.organizer}

🔗 पूरी जानकारी देखें: ${eventUrl}

_Santvaani पर आध्यात्मिक कार्यक्रम खोजें_ ✨
#SantvaaniEvent ${typeHashtag} #Santvaani`;

  return encodeURIComponent(message);
}
