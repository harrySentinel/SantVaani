// Test script to verify Brevo email service is working
// Run: node test_email.js

const { sendWelcomeEmail } = require('./email_service');

// IMPORTANT: Before running this test:
// 1. Make sure you've added a verified sender email in Brevo dashboard
// 2. Go to: https://app.brevo.com/settings/senders
// 3. Add and verify: noreply@santvaani.com (or any email you have access to)

console.log('🧪 Testing Santvaani Email Service...\n');

// Replace with YOUR email to receive the test
const testEmail = 'adityasrivastav9721057380@gmail.com'; // Change this to your email
const testName = 'Aditya';

console.log(`📧 Sending welcome email to: ${testEmail}`);
console.log(`👤 User name: ${testName}\n`);

sendWelcomeEmail(testEmail, testName)
  .then(result => {
    if (result.success) {
      console.log('\n✅ SUCCESS! Email sent successfully!');
      console.log('📬 Check your inbox (and spam folder)');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('\n❌ FAILED to send email');
      console.log('Error:', result.error);
      console.log('\n🔍 Common issues:');
      console.log('1. Sender email not verified in Brevo dashboard');
      console.log('2. Invalid API key');
      console.log('3. Account not activated');
    }
  })
  .catch(error => {
    console.error('\n❌ ERROR:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check if BREVO_API_KEY is set in .env file');
    console.log('2. Verify sender email in Brevo dashboard');
    console.log('3. Make sure Brevo account is activated');
  });
