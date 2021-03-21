import React, {createContext} from 'react'

export const UserContext = React.createContext({
  userLoading: true,
  userFirstName: '',
  userFullName: '',
  userEmail: '',
  userTimeZone: '',
  // userPhoto: require('./images/no-profile-pic.png')
})
