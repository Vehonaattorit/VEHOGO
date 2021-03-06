import React, {useState, useReducer} from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import {AuthManager} from './auth/AuthManager'

const calendarHooks = () => {
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
            userToken: action.token,
          }
        case 'SIGN_IN':
          return {
            userToken: action.token,
          }
        case 'SIGN_OUT':
          return {
            userToken: null,
          }
      }
    },
    {
      userToken: null,
    }
  )

  const signInAsync = async () => {
    const response = await AuthManager.signInAsync()

    if (
      response.loadingEvents !== null &&
      response.loadingEvents !== undefined
    ) {
      if (response.events !== null && response.events !== undefined) {
        setCalendarState({
          loadingEvents: response.loadingEvents || false,
          events: response.events,
        })

        dispatch({type: 'SIGN_IN', token: response.userToken})
      }
    }
  }

  const signOutAsync = async () => {
    // Clear storage

    await AsyncStorage.removeItem('userToken')
    await AsyncStorage.removeItem('refreshToken')
    await AsyncStorage.removeItem('expireTime')

    setCalendarState({
      loadingEvents: true,
      events: [],
    })

    dispatch({type: 'SIGN_OUT', token: null})
  }

  // exp:192.168.1.3:19000

  // vehogo://

  const bootstrapAsync = async () => {
    const response = await AuthManager.checkTokenExpiration()

    if (
      response.loadingEvents !== null &&
      response.loadingEvents !== undefined
    ) {
      if (response.events !== null && response.events !== undefined) {
        setCalendarState({
          loadingEvents: response.loadingEvents,
          events: response.events,
        })

        dispatch({type: 'SIGN_IN', token: response.userToken})
      }
    }
  }

  return {
    state,
    userState,
    calendarState,
    bootstrapAsync,
    signOutAsync,
    signInAsync,
  }
}

export default calendarHooks
