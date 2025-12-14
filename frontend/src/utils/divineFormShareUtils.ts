// Divine Form specific share utilities
export interface DivineFormShareData {
  name: string;
  name_hi: string;
  domain: string;
  domain_hi?: string;
  description: string;
  description_hi?: string;
  mantra: string;
  attributes: string[];
  id: string;
}

// Generate formatted WhatsApp message for Divine Forms
export function generateDivineFormWhatsAppMessage(form: DivineFormShareData): string {
  const baseUrl = window.location.origin;
  const formUrl = `${baseUrl}/divine#${form.id}`;
  
  const attributes = form.attributes.slice(0, 3).join(', ');
  
  const message = `🕉️ *${form.name}* ${form.name_hi ? `(${form.name_hi})` : ''}

"${form.domain_hi || form.domain}"
🙏 *मंत्र*: ${form.mantra}
✨ *गुण*: ${attributes}

${form.description_hi ? form.description_hi.substring(0, 100) + '...' : form.description.substring(0, 100) + '...'}

🔗 पूर्ण विवरण पढ़ें: ${formUrl}

_Santvaani पर दिव्य रूपों के बारे में और जानें_ 🔱
#DivineForm #${form.name.replace(/\s+/g, '')} #Santvaani #Spirituality`;

  return encodeURIComponent(message);
}