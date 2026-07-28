'use client'

import { inviteAdmin } from '@/app/lib/data/actions'
import { useState } from 'react'

export default function CreateAdminPage() {
  const [credentials, setCredentials] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const email = e.target.email.value
    try {
      const result = await inviteAdmin(email)
      setCredentials(result)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='w-full h-full z-40 left-0
    flex flex-col justify-center items-center absolute'>
      <h1>Create Admin</h1>
 <form onSubmit={handleSubmit}>
    <input name="email" type="email" placeholder="Admin email" required />

      <button >Create Admin</button>
 </form>

   {error && <p style={{ color: 'red' }}>{error}</p>}

      {credentials && (
        <div>
          <p>Share these credentials with the new admin:</p>
          <p>Email: {credentials.email}</p>
          <p>Password: {credentials.password}</p>
          <p><em>Ask them to change their password after first login.</em></p>
        </div>
      )}
    </div>
  )
}