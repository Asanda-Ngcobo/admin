'use client'


import { supabase } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')

  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
      data: { force_password_reset: false }
    })

    if (!error) router.push('/dashboard')
  }

  return (
    <div>
      <h1>Set New Password</h1>
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={updatePassword}>Update</button>
    </div>
  )
}