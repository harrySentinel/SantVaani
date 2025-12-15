// Email Scheduler - Automated milestone emails (7-day and 30-day)
// This runs daily to send milestone emails to users

const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const { send7DayEmail, send30DayEmail } = require('./email_service');

// Initialize Supabase admin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// DATABASE SETUP FOR EMAIL TRACKING
// ============================================

// Create email_sent_logs table if it doesn't exist
async function setupEmailTracking() {
  try {
    // Check if table exists by trying to query it
    const { error } = await supabase
      .from('email_sent_logs')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      // Table doesn't exist - create it
      console.log('📊 Creating email_sent_logs table...');

      // We'll create it using raw SQL
      const { error: createError } = await supabase.rpc('create_email_logs_table');

      if (createError) {
        console.log('⚠️  Note: email_sent_logs table may need manual creation');
        console.log('   Run this SQL in Supabase SQL Editor:');
        console.log(`
CREATE TABLE IF NOT EXISTS email_sent_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'welcome', '7day', '30day', 'broadcast'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  UNIQUE(user_id, email_type)
);

CREATE INDEX idx_email_logs_user_id ON email_sent_logs(user_id);
CREATE INDEX idx_email_logs_email_type ON email_sent_logs(email_type);
        `);
      } else {
        console.log('✅ Email tracking table created successfully');
      }
    } else if (!error) {
      console.log('✅ Email tracking table already exists');
    }
  } catch (error) {
    console.error('❌ Error setting up email tracking:', error);
  }
}

// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================

// Check if email was already sent to user
async function wasEmailSent(userId, emailType) {
  try {
    const { data, error } = await supabase
      .from('email_sent_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('email_type', emailType)
      .single();

    return !error && data !== null;
  } catch (error) {
    // If table doesn't exist or any error, assume not sent
    return false;
  }
}

// Log that email was sent
async function logEmailSent(userId, userEmail, emailType, success, errorMessage = null) {
  try {
    await supabase
      .from('email_sent_logs')
      .insert({
        user_id: userId,
        user_email: userEmail,
        email_type: emailType,
        success,
        error_message: errorMessage
      });
  } catch (error) {
    console.error(`Failed to log email for ${userEmail}:`, error);
  }
}

// Send 7-day milestone emails
async function send7DayMilestoneEmails() {
  try {
    console.log('\n📧 Checking for 7-day milestone users...');

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const eightDaysAgo = new Date(sevenDaysAgo);
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 1);

    // Query Supabase auth admin to get users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    // Filter users created 7 days ago
    const sevenDayUsers = users.filter(user => {
      const createdAt = new Date(user.created_at);
      return createdAt >= eightDaysAgo && createdAt < sevenDaysAgo;
    });

    console.log(`   Found ${sevenDayUsers.length} users who signed up 7 days ago`);

    let sentCount = 0;
    let skipCount = 0;

    for (const user of sevenDayUsers) {
      // Check if email was already sent
      const alreadySent = await wasEmailSent(user.id, '7day');

      if (alreadySent) {
        skipCount++;
        continue;
      }

      // Get user's name from metadata
      const userName = user.user_metadata?.name || user.user_metadata?.full_name || 'Friend';

      console.log(`   📤 Sending 7-day email to: ${user.email}`);

      // Send email
      const result = await send7DayEmail(user.email, userName);

      // Log result
      if (result.success) {
        await logEmailSent(user.id, user.email, '7day', true);
        sentCount++;
        console.log(`   ✅ Sent to ${user.email}`);
      } else {
        await logEmailSent(user.id, user.email, '7day', false, result.error);
        console.log(`   ❌ Failed to send to ${user.email}:`, result.error);
      }

      // Wait 1 second between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`   📊 Results: ${sentCount} sent, ${skipCount} skipped (already sent)\n`);

  } catch (error) {
    console.error('❌ Error in 7-day milestone job:', error);
  }
}

// Send 30-day milestone emails
async function send30DayMilestoneEmails() {
  try {
    console.log('\n🏆 Checking for 30-day milestone users...');

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const thirtyOneDaysAgo = new Date(thirtyDaysAgo);
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 1);

    // Query Supabase auth admin to get users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    // Filter users created 30 days ago
    const thirtyDayUsers = users.filter(user => {
      const createdAt = new Date(user.created_at);
      return createdAt >= thirtyOneDaysAgo && createdAt < thirtyDaysAgo;
    });

    console.log(`   Found ${thirtyDayUsers.length} users who signed up 30 days ago`);

    let sentCount = 0;
    let skipCount = 0;

    for (const user of thirtyDayUsers) {
      // Check if email was already sent
      const alreadySent = await wasEmailSent(user.id, '30day');

      if (alreadySent) {
        skipCount++;
        continue;
      }

      // Get user's name from metadata
      const userName = user.user_metadata?.name || user.user_metadata?.full_name || 'Friend';

      console.log(`   📤 Sending 30-day email to: ${user.email}`);

      // Send email
      const result = await send30DayEmail(user.email, userName);

      // Log result
      if (result.success) {
        await logEmailSent(user.id, user.email, '30day', true);
        sentCount++;
        console.log(`   ✅ Sent to ${user.email}`);
      } else {
        await logEmailSent(user.id, user.email, '30day', false, result.error);
        console.log(`   ❌ Failed to send to ${user.email}:`, result.error);
      }

      // Wait 1 second between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`   📊 Results: ${sentCount} sent, ${skipCount} skipped (already sent)\n`);

  } catch (error) {
    console.error('❌ Error in 30-day milestone job:', error);
  }
}

// Run both milestone email jobs
async function runMilestoneEmailJobs() {
  console.log('\n🚀 ============================================');
  console.log('🚀 Running Milestone Email Jobs');
  console.log('🚀 Time:', new Date().toLocaleString());
  console.log('🚀 ============================================');

  await send7DayMilestoneEmails();
  await send30DayMilestoneEmails();

  console.log('🚀 ============================================');
  console.log('🚀 Milestone Email Jobs Completed');
  console.log('🚀 ============================================\n');
}

// ============================================
// CRON SCHEDULER
// ============================================

function startEmailScheduler() {
  console.log('\n📅 ============================================');
  console.log('📅 Email Scheduler Initialized');
  console.log('📅 ============================================');
  console.log('📅 Schedule: Daily at 9:00 AM IST');
  console.log('📅 Jobs:');
  console.log('   • 7-day milestone emails');
  console.log('   • 30-day milestone emails');
  console.log('📅 ============================================\n');

  // Setup email tracking table
  setupEmailTracking();

  // Schedule cron job to run daily at 9:00 AM IST (3:30 AM UTC)
  // Cron format: second minute hour day month weekday
  cron.schedule('30 3 * * *', () => {
    runMilestoneEmailJobs();
  }, {
    timezone: 'UTC'
  });

  console.log('✅ Email scheduler is now running!\n');
}

// Export functions
module.exports = {
  startEmailScheduler,
  runMilestoneEmailJobs, // For manual testing
  send7DayMilestoneEmails,
  send30DayMilestoneEmails
};
