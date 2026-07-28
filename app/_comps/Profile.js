'use client'

import { LogOut, PlusCircle, Settings } from '@deemlol/next-icons'
import Image from 'next/image'
import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import Link from 'next/link'
import { supabase } from '../lib/supabase/client'


function Profile({ data }) {
  const [showProfile, setShowProfile] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { email } = data;
  

  function handleShowProfile() {
    setShowProfile(prev => !prev)
  }

 

  //   const initials = Name
  // .split(/\s+/)
  // .slice(0, 2)
  // .map(word => word[0]?.toUpperCase())
  // .join('');

  const logout = () => {
    startTransition(async () => {
     
      
      await supabase.auth.signOut()
      router.push('/')
    })
  }

  return (
    <>
      {showProfile && (
        <div className="bg-background w-[96%]
        bottom-30 absolute mx-auto rounded-lg mb-4 z-20">
          <div className="flex gap-3 ml-2 items-center h-[10vh]
          ">
   
  <div className='w-15 h-15 bg-(--accent-primary) rounded-full
  flex justify-center items-center'>
    Admin
  </div>


            <div>
      
              <div className="text-xs">{email}</div>
            </div>
          </div>

          <ul>
            <li className="flex ml-2 gap-5 py-3">
               <PlusCircle/> <button>
      <Link href='admin/create'>
      Create Admin
      </Link>
    </button>
            </li>

            <li
              onClick={!isPending ? logout : undefined}
              className={`flex ml-2 gap-5 py-3 ${
                isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <LogOut />
              {isPending ? 'Logging out…' : 'Log out'}
            </li>
          </ul>
        </div>
      )}

      <div
        className={`${showProfile ? 'w-[90%]' : 'w-[94%]'} h-[10vh] mx-auto
        bottom-3 absolute
          rounded-md bg-background flex gap-3 justify-center items-center cursor-pointer`}
        onClick={handleShowProfile}
      >

  
<div className='w-15 h-15 bg-(--accent-primary) rounded-full
  flex justify-center items-center'>
    Admin
  </div>

        <div>{email}</div>
      </div>
    </>
  )
}

export default Profile
