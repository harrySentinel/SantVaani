import { createClient } from '@supabase/supabase-js'

// Use your existing Supabase configuration
const supabaseUrl = 'https://uamedkwrdwcwdznakdvq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbWVka3dyZHdjd2R6bmFrZHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Nzc1MTgsImV4cCI6MjA2NTQ1MzUxOH0.7FMlc38-NyB3hyzF6z9NblHUZ5XHZyHe362xpG4ceqk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminUser() {
  const adminEmail = 'admin@gmail.com'
  const adminPassword = 'santvaani2024'

  try {
    console.log('🔐 Creating admin user...')

    // Sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          name: 'SantVaani Admin',
          role: 'admin'
        }
      }
    })

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log('✅ Admin user already exists!')
        console.log('\n📧 Use these credentials:')
        console.log(`   Email: ${adminEmail}`)
        console.log(`   Password: ${adminPassword}`)
      } else {
        console.error('❌ Error creating admin user:', error.message)
      }
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('\n📧 Admin Credentials:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\n🔗 Admin Panel: http://localhost:3002')
    console.log('\n💡 The email contains "admin" so it will have admin privileges')

  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message)
  }
}

createAdminUser()