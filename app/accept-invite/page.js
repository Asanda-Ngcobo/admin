'use client'


import { supabase } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AcceptInvite() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const submit = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
      data: { force_password_reset: false }
    })

    if (error) return setError(error.message)

    router.push('/dashboard')
  }

  return (
    <div>
      <h1>Set your admin password</h1>

      <input
        type="password"
        placeholder="New password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={submit}>Continue</button>

      {error && <p>{error}</p>}
    </div>
  )
}