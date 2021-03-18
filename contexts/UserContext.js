import React, {createContext} from 'react'

export const UserContext = React.createContext({
  userLoading: true,
  userFirstName: '',
  userFullName: '',
  userEmail: '',
  userTimeZone: '',
  // userPhoto: require('./images/no-profile-pic.png')
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
