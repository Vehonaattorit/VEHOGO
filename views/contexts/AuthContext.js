import React, {createContext} from 'react'

export const AuthContext = createContext({
  signIn: async () => {},
  signOut: () => {},
})
