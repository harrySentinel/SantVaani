# 📧 Form Integration Guide for SantVaani

This guide shows you how to make your feedback and ashram contact forms functional.

## 🚀 Option 1: EmailJS (Recommended - Easiest)

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for free account
3. Verify your email

### Step 2: Setup Email Service
1. **Add Email Service:**
   - Go to "Email Services" tab
   - Click "Add New Service"
   - Choose Gmail/Outlook/Yahoo (whichever you use)
   - Follow authentication steps

2. **Get Service ID:**
   - Note down your Service ID (e.g., `service_xyz123`)

### Step 3: Create Email Templates

#### Feedback Form Template:
1. Go to "Email Templates" tab
2. Click "Create New Template"
3. Use this template:

**Subject:** `New Feedback from {{from_name}} - SantVaani`

**Content:**
```
Dear SantVaani Team,

You have received new feedback through your website.

📝 Feedback Details:
• Name: {{from_name}}
• Email: {{from_email}}
• Category: {{category}}
• Rating: {{rating}}/5 stars
• Date: {{date}}

💭 Feedback Message:
{{feedback}}

---
This email was automatically generated from the SantVaani website feedback form.
```

4. Save and note the Template ID

#### Ashram Application Template:
1. Create another template for ashram applications:

**Subject:** `New Organization Application - {{organization_name}}`

**Content:**
```
Dear SantVaani Partnerships Team,

A new organization has submitted an application to join your donation network.

🏛️ Organization Details:
• Name: {{organization_name}}
• Type: {{organization_type}}
• Contact Person: {{contact_person}}
• Phone: {{phone}}
• Email: {{email}}
• Address: {{full_address}}
• Established: {{established_year}}
• Beneficiaries: {{beneficiaries}}

💰 Financial Information:
• Monthly Requirement: {{monthly_requirement}}
• Bank Account: {{bank_account}}
• IFSC Code: {{ifsc_code}}
• PAN Number: {{pan_number}}
• Registration Number: {{registration_number}}

📋 Additional Details:
• Specific Needs: {{specific_needs}}
• Available Documents: {{documents}}
• Description: {{description}}

Application Date: {{application_date}}

---
Please review and contact the organization for verification.
```

### Step 4: Configure Your Code

1. **Update the email service file:**
   Open `frontend/src/lib/emailService.ts` and replace the placeholder values:

```typescript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'your_actual_public_key',           // From EmailJS dashboard
  FEEDBACK_SERVICE_ID: 'service_xyz123',          // Your email service ID
  FEEDBACK_TEMPLATE_ID: 'template_feedback123',   // Feedback template ID
  ASHRAM_SERVICE_ID: 'service_xyz123',            // Same service ID
  ASHRAM_TEMPLATE_ID: 'template_ashram456',       // Ashram template ID
};
```

2. **Install EmailJS:**
```bash
cd frontend
npm install @emailjs/browser
```

3. **Enable the forms:**
   - In `FeedbackForm.tsx`: Uncomment the EmailJS lines (lines 37-40)
   - In `AshramContactForm.tsx`: Uncomment the EmailJS lines (lines 48-51)

4. **Add the import:**
   Add this to both form files:
```typescript
import { sendFeedback, sendAshramApplication } from '@/lib/emailService';
```

### Step 5: Test Your Forms
1. Deploy your website
2. Fill out the feedback form
3. Check your email inbox
4. Verify the ashram form works too

---

## 🛡️ Option 2: Supabase Database (More Advanced)

If you want to store form submissions in a database:

### Step 1: Create Tables
```sql
-- Feedback table
CREATE TABLE feedback_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  category VARCHAR(50),
  rating INTEGER,
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ashram applications table
CREATE TABLE ashram_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name VARCHAR(200) NOT NULL,
  organization_type VARCHAR(50),
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  established_year VARCHAR(4),
  beneficiaries VARCHAR(10),
  monthly_requirement VARCHAR(100),
  specific_needs TEXT,
  bank_account VARCHAR(50),
  ifsc_code VARCHAR(20),
  pan_number VARCHAR(20),
  registration_number VARCHAR(100),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 2: Update Form Functions
Replace the console.log calls with Supabase inserts.

---

## 📞 Option 3: Direct Email Integration

For very high volume, you can use services like:
- **SendGrid**
- **Mailgun** 
- **Amazon SES**

These require more setup but offer better deliverability.

---

## 🎯 Recommendation

**Start with EmailJS** - it's:
- ✅ Free for up to 200 emails/month
- ✅ No server needed
- ✅ Works immediately
- ✅ Perfect for MVP

You can always upgrade to a more robust solution later as your platform grows.

---

## 🚨 Important Notes

1. **Email Limits:** EmailJS free tier allows 200 emails/month
2. **Spam Protection:** Consider adding reCAPTCHA if you get spam
3. **Data Privacy:** Add privacy policy mentioning data collection
4. **Backup:** Always log form submissions to console as backup
5. **Testing:** Test forms thoroughly before going live

---

## 🆘 Need Help?

If you face any issues:
1. Check browser console for errors
2. Verify EmailJS credentials
3. Test email templates in EmailJS dashboard
4. Ensure internet connection during form submission

Your forms are now ready to collect real feedback and partner applications! 🎉