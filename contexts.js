import React, {useState} from 'react'
import PropTypes from 'prop-types'

const UserContext = React.createContext({})

const UserProvider = ({children}) => {
  const [user, setUser] = useState({})
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node,
}

export {UserContext, UserProvider}
