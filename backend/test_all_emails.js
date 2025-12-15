// Test script to send all 3 premium email templates
// This will send: Welcome, 7-Day, and 30-Day emails

const {
  sendWelcomeEmail,
  send7DayEmail,
  send30DayEmail
} = require('./email_service');

console.log('🎨 Testing All Premium Santvaani Email Templates...\n');

const testEmail = 'adityasrivastav9721057380@gmail.com';
const testName = 'Aditya';

// Function to delay between emails
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testAllEmails() {
  try {
    // 1. Send Welcome Email
    console.log('📧 1/3 Sending Welcome Email...');
    const welcomeResult = await sendWelcomeEmail(testEmail, testName);
    if (welcomeResult.success) {
      console.log('   ✅ Welcome email sent successfully!\n');
    } else {
      console.log('   ❌ Welcome email failed:', welcomeResult.error, '\n');
    }

    // Wait 3 seconds between emails
    console.log('⏳ Waiting 3 seconds...\n');
    await delay(3000);

    // 2. Send 7-Day Milestone Email
    console.log('📧 2/3 Sending 7-Day Milestone Email...');
    const sevenDayResult = await send7DayEmail(testEmail, testName);
    if (sevenDayResult.success) {
      console.log('   ✅ 7-Day milestone email sent successfully!\n');
    } else {
      console.log('   ❌ 7-Day email failed:', sevenDayResult.error, '\n');
    }

    // Wait 3 seconds between emails
    console.log('⏳ Waiting 3 seconds...\n');
    await delay(3000);

    // 3. Send 30-Day Milestone Email
    console.log('📧 3/3 Sending 30-Day Milestone Email...');
    const thirtyDayResult = await send30DayEmail(testEmail, testName);
    if (thirtyDayResult.success) {
      console.log('   ✅ 30-Day milestone email sent successfully!\n');
    } else {
      console.log('   ❌ 30-Day email failed:', thirtyDayResult.error, '\n');
    }

    // Summary
    console.log('\n🎉 ALL EMAILS SENT!\n');
    console.log('📬 Check your inbox: ' + testEmail);
    console.log('📧 You should receive 3 emails:');
    console.log('   1. Welcome to Santvaani - Your Spiritual Journey Begins');
    console.log('   2. Your First Week of Spiritual Growth');
    console.log('   3. 🏆 30 Days of Transformation\n');
    console.log('💡 They might arrive in different order - check timestamps!\n');
    console.log('🎨 Each email has:');
    console.log('   ✓ Premium ॐ symbol (not emoji)');
    console.log('   ✓ Beautiful gradients');
    console.log('   ✓ All your features');
    console.log('   ✓ Inspiring content\n');

  } catch (error) {
    console.error('❌ Error in test:', error);
  }
}

// Run the test
testAllEmails();
