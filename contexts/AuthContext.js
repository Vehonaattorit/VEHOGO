import React, {createContext} from 'react'

export const AuthContext = createContext({
  signIn: async () => {
    console.log('sign In')
  },
  signOut: () => {
    console.log('sign out')
  },
})

// const AuthProvider = ({children}) => {

// return (
//   <AuthContext.Provider value={
//     {
//       signIn: async () => {},
//       signOut: () => {}
//      }}>
//     {children}
//   </AuthContext.Provider>
// )

// signIn: async () => {},
// signOut: () => {}
// export {AuthContext, AuthProvider}
