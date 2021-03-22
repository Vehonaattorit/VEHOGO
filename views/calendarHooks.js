import React, {useState, useReducer} from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import {AuthManager} from '../auth/AuthManager'

const calendarHooks = () => {
  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        const response = await AuthManager.signInAsync()

        console.log('calendarHooks response', response)

        setCalendarState({
          loadingEvents: response.loadingEvents,
          events: response.events,
        })

        dispatch({type: 'SIGN_IN', token: response.userToken})
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

  const [calendarState, setCalendarState] = useState({
    loadingEvents: true,
    events: [],
  })

  const [userState, setUserState] = useState({
    userLoading: true,
    userFirstName: 'Adele',
    userFullName: 'Adele Vance',
    userEmail: 'adelev@contoso.com',
    userTimeZone: 'UTC',
    // userPhoto: require('../images/no-profile-pic.png')
  })

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

  const bootstrapAsync = async () => {
    // let userToken = null
    const userToken = await AsyncStorage.getItem('userToken')

    if (userToken) {
      const response = await AuthManager.callMsGraph(userToken)
      setCalendarState({
        loadingEvents: response.loadingEvents,
        events: response.events,
      })

      dispatch({type: 'SIGN_IN', token: response.userToken})
    } else {
      signInAsync()
    }
  }

  return {
    state,
    userState,
    calendarState,
    bootstrapAsync,
    signInAsync,
    signOutAsync,
    authContext,
  }
}

export default calendarHooks
