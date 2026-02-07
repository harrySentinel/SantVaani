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
    case 'bhagwad-katha': return '\u{1F4FF}';  // 📿
    case 'bhandara': return '\u{1F37D}\uFE0F';  // 🍽️
    case 'kirtan': return '\u{1F3B5}';           // 🎵
    case 'satsang': return '\u{1F549}\uFE0F';    // 🕉️
    default: return '\u{1F64F}';                  // 🙏
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
    ? `\n\n\u{1F48C} ${invitation.substring(0, 150)}${invitation.length > 150 ? '...' : ''}`
    : '';

  const message = `${emoji} *${event.title}*
_${typeLabel}_

\u{1F4C5} ${formattedDate}
\u{1F550} ${event.time}
\u{1F4CD} ${event.location}, ${event.city}${invitationPreview}

\u{1F464} Organized by: ${event.organizer}

\u{1F517} \u092A\u0942\u0930\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0926\u0947\u0916\u0947\u0902: ${eventUrl}

_Santvaani \u092A\u0930 \u0906\u0927\u094D\u092F\u093E\u0924\u094D\u092E\u093F\u0915 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E \u0916\u094B\u091C\u0947\u0902_ \u2728
#SantvaaniEvent ${typeHashtag} #Santvaani`;

  return encodeURIComponent(message);
}
