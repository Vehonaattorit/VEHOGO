import React, {createContext} from 'react'

export const AuthContext = createContext({
  signIn: async () => {
    console.log('sign In')
  },
  signOut: () => {
    console.log('sign out')
  },
})
