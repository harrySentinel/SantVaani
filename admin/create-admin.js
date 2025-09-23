import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key needed for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.log('Make sure you have VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const adminEmail = 'admin@santvaani.com'
  const adminPassword = 'admin123456'

  try {
    console.log('🔐 Creating admin user...')

    // Create user with admin email
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: 'admin',
        name: 'SantVaani Admin'
      }
    })

    if (error) {
      console.error('❌ Error creating admin user:', error.message)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('\n📧 Admin Credentials:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\n🔗 Admin Panel: http://localhost:3002')
    console.log('\n⚠️  Please change this password after first login!')

  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message)
  }
}

createAdminUser()