import emailjs from '@emailjs/browser';

// Replace these with your actual EmailJS credentials
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'your_public_key_here', // Get from EmailJS dashboard
  FEEDBACK_SERVICE_ID: 'your_feedback_service_id',
  FEEDBACK_TEMPLATE_ID: 'your_feedback_template_id',
  ASHRAM_SERVICE_ID: 'your_ashram_service_id',
  ASHRAM_TEMPLATE_ID: 'your_ashram_template_id',
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export interface FeedbackData {
  name: string;
  email: string;
  feedback: string;
  rating: number;
  category: string;
}

export interface AshramData {
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  establishedYear: string;
  beneficiaries: string;
  monthlyRequirement: string;
  specificNeeds: string;
  documents: string;
  bankAccount: string;
  ifscCode: string;
  panNumber: string;
  registrationNumber: string;
  description: string;
}

export const sendFeedback = async (data: FeedbackData): Promise<boolean> => {
  try {
    const templateParams = {
      to_name: 'SantVaani Team',
      from_name: data.name,
      from_email: data.email,
      category: data.category,
      rating: data.rating,
      feedback: data.feedback,
      date: new Date().toLocaleDateString('en-IN'),
    };

    await emailjs.send(
      EMAILJS_CONFIG.FEEDBACK_SERVICE_ID,
      EMAILJS_CONFIG.FEEDBACK_TEMPLATE_ID,
      templateParams
    );

    return true;
  } catch (error) {
    console.error('Failed to send feedback:', error);
    return false;
  }
};

export const sendAshramApplication = async (data: AshramData): Promise<boolean> => {
  try {
    const templateParams = {
      to_name: 'SantVaani Partnerships',
      organization_name: data.organizationName,
      organization_type: data.organizationType,
      contact_person: data.contactPerson,
      phone: data.phone,
      email: data.email,
      full_address: `${data.address}, ${data.city}, ${data.state} - ${data.pincode}`,
      established_year: data.establishedYear,
      beneficiaries: data.beneficiaries,
      monthly_requirement: data.monthlyRequirement,
      specific_needs: data.specificNeeds,
      documents: data.documents,
      bank_account: data.bankAccount,
      ifsc_code: data.ifscCode,
      pan_number: data.panNumber,
      registration_number: data.registrationNumber,
      description: data.description,
      application_date: new Date().toLocaleDateString('en-IN'),
    };

    await emailjs.send(
      EMAILJS_CONFIG.ASHRAM_SERVICE_ID,
      EMAILJS_CONFIG.ASHRAM_TEMPLATE_ID,
      templateParams
    );

    return true;
  } catch (error) {
    console.error('Failed to send ashram application:', error);
    return false;
  }
};