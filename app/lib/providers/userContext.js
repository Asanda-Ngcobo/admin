
'use client'
import { createContext, useContext } from 'react'

const UserContext = createContext(null)

export function UserProvider({ data, children }) {
  return (
    <UserContext.Provider value={data}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}