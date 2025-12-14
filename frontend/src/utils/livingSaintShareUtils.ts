// Living Saints specific share utilities
export interface LivingSaintShareData {
  name: string;
  nameHi: string;
  organization: string;
  specialty: string;
  specialtyHi: string;
  description: string;
  descriptionHi: string;
  currentLocation: string;
  currentLocationHi: string;
  id: string;
}

// Generate formatted WhatsApp message for Living Saints
export function generateLivingSaintWhatsAppMessage(saint: LivingSaintShareData): string {
  const baseUrl = window.location.origin;
  const saintUrl = `${baseUrl}/living-saints#${saint.id}`;
  
  const message = `🙏 *${saint.name}* ${saint.nameHi ? `(${saint.nameHi})` : ''}

"${saint.specialtyHi || saint.specialty}"
📍 ${saint.currentLocationHi || saint.currentLocation}
🏛️ ${saint.organization}

${saint.descriptionHi ? saint.descriptionHi.substring(0, 120) + '...' : saint.description.substring(0, 120) + '...'}

🔗 पूर्ण जानकारी पढ़ें: ${saintUrl}

_Santvaani पर समसामयिक आध्यात्मिक गुरुओं से जुड़ें_ ✨
#LivingSaint #${saint.name.replace(/\s+/g, '')} #Santvaani #Spirituality`;

  return encodeURIComponent(message);
}