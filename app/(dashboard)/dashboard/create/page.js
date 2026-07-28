'use client'

import { inviteAdmin } from '@/app/lib/data/actions'
import { useState } from 'react'

export default function CreateAdminPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  const submit = async () => {
    try {
      await inviteAdmin(email)
      setStatus('Admin created')
    } catch (e) {
      setStatus(e.message)
    }
  }

  return (
    <div className='w-full h-full z-40 left-0
    flex flex-col justify-center items-center absolute'>
      <h1>Create Admin</h1>

      <input
        placeholder="admin@email.com"
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={submit}>Create</button>

      {status && <p>{status}</p>}
    </div>
  )
}