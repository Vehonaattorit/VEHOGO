import React, {useContext, useState} from 'react'
import {View, Text, Button} from 'react-native'

import {AuthContext} from '../contexts/AuthContext'
import {UserContext} from '../contexts/UserContext'

// 7c89d5a2-62cd-46e2-859a-dc26644c7e1f azure app

const OutlookCalendar = () => {
  const {signIn, signOut} = useContext(AuthContext)

  const userContext = useContext(UserContext)

  const [userState, setUserState] = useState({
    // TEMPORARY
    userLoading: true,
    userFirstName: 'Adele',
    userFullName: 'Adele Vance',
    userEmail: 'adelev@contoso.com',
    userTimeZone: 'UTC',
    // userPhoto: require('../images/no-profile-pic.png')
  })

  return (
    <View>
      <Text> Test 123</Text>
      <Button
        title="Sign in"
        onPress={() => {
          signIn()
        }}
      />
      <Button
        title="Sign out"
        onPress={() => {
          signOut()
        }}
      />
    </View>
  )
}

export default OutlookCalendar
