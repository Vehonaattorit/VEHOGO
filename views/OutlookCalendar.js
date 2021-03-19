import React, {useEffect, useReducer, useContext, useState} from 'react'
import {StyleSheet, SafeAreaView, View, Text, Button} from 'react-native'

import {AuthContext} from '../contexts/AuthContext'
import {UserContext} from '../contexts/UserContext'

import {AuthManager} from '../auth/AuthManager'
import AsyncStorage from '@react-native-community/async-storage'
import OutlookUser from './OutlookUser'
import NewEventComponent from './NewEventComponent'

const OutlookCalendar = () => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignOut: false,
            userToken: action.token,
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
            userToken: null,
          }
      }
    },
    {
      isLoading: true,
      isSignOut: false,
      userToken: null,
    }
  )

  useEffect(() => {
    const bootstrapAsync = async () => {
      // let userToken = null
      const userToken = await AsyncStorage.getItem('userToken')

      console.log('bootstrap async', userToken)
      dispatch({type: 'RESTORE_TOKEN', token: userToken})

      console.log('RESTORE TOKEN', state.userToken)
    }

    bootstrapAsync()
  }, [state.userToken, state.isSignOut, state.isLoading])

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

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        console.log('Sign in')
        await AuthManager.signInAsync()
        const token = await AuthManager.getAccessTokenAsync()

        console.log('authContext token', token)
        dispatch({type: 'SIGN_IN', token})
      },
      signOut: async () => {
        await AuthManager.signOutAsync()
        dispatch({type: 'SIGN_OUT'})
      },
    }),
    []
  )

  const signInAsync = async () => {
    await authContext.signIn()
  }

  const signOutAsync = async () => {
    await authContext.signOut()
  }

  return (
    <AuthContext.Provider value={authContext}>
      <SafeAreaView style={styles.container}>
        <Button
          title="Sign in"
          onPress={() => {
            signInAsync()
          }}
        />
        <Button
          title="Sign out"
          onPress={() => {
            signOutAsync()
          }}
        />
        {state.isLoading ? (
          <Text>Loading</Text>
        ) : state.userToken == null ? (
          <Text>User is not signed in </Text>
        ) : (
          <>
            <NewEventComponent />

            {/* <OutlookUser /> */}
          </>
        )}
      </SafeAreaView>
    </AuthContext.Provider>
  )
}

export default OutlookCalendar

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
})
