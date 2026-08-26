'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { supabase } from './lib/supabase/client'


 

export default function Home() {
   const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isPending, startTransition] = useTransition();

  const login = async (e) => {
  startTransition(async () =>{
     e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })


    if (error) return setError(error.message)

    const user = data.user

    if (user?.app_metadata?.role !== 'admin') {

     
      await supabase.auth.signOut()
      return setError('Unauthorized')
    }

   
      router.push('/dashboard')

      })
   
    
  }
  return (
    <div className="flex min-h-screen items-center justify-center
      font-(--font-sans)
      bg-background ">
      <div className="h-[70vh] w-[60%] flex flex-row justify-center
       items-center
      rounded-lg shadow shadow-gray-400">
        <div className="w-1/2">
        <h1 className="text-2xl text-(--accent-primary) text-center
        font-sans">Grossary</h1>

        </div>
        <div className="flex flex-col w-1/2 h-full
         justify-center items-center">
           <h1 className="text-2xl text-(--text-secondary) text-center
        font-sans">WELCOME </h1>
        <h3 className="text-xs text-(--text-secondary) text-center
        font-sans">PLEASE LOGIN TO ADMIN DASHBOARD</h3>
        <form className=""
          onSubmit={login}>

          <input name="email" 
          type="text" 
          required 
          placeholder="Email Address"
          id="email"
            className="rounded-sm
                px-4 border w-[80%] my-2 mx-[10%] py-3 border-gray-400
                focus focus:outline-2 focus:outline-(--accent-secondary) 
                focus:border-0 "
                value={email}
                onChange={e => setEmail(e.target.value)} 
          />
             
          <input name="password" 
          type="password" 
          required 
          placeholder="Password"
          id="password"
            className="rounded-sm
                px-4 border w-[80%] my-2 mx-[10%] py-3 border-gray-400
                focus focus:outline-2 focus:outline-(--accent-secondary) 
                focus:border-0 "
                value={password}
                onChange={e => setPassword(e.target.value)}
          />

          <button className="w-[80%] mx-[10%] px-4 py-3
           rounded-sm bg-(--accent-primary) text-white
          "
        disabled={isPending}>
          {isPending ? 'Signing in...': 'Sign In'} 
           </button>
             {error && <p>{error}</p>}

          <p className="w-fit mx-auto flex justify-center gap-6 text-blue-400"><Link href='forgot-password'
          >
          Forgot password?</Link></p>
      
        </form>
      
        </div>
        
        
      </div>
     
    </div>
  );
}