
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createFirstAdmin() {
  const email = 'asanda@preci.co.za'
  const tempPassword = crypto.randomUUID()

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      role: 'admin',
     
    }
  })

  if (error) {
    console.error(error)
    process.exit(1)
  }

  console.log('✅ First admin created')
  console.log('Email:', email)
  console.log('Temp password:', tempPassword)
}

createFirstAdmin()