import React, {useState, useReducer} from 'react'
import moment from 'moment-timezone'
import {findIana} from 'windows-iana'
import AsyncStorage from '@react-native-community/async-storage'
import {GraphManager} from './graph/GraphManager'

import {AuthManager} from '../auth/AuthManager'

import {Alert} from 'react-native'

const calendarHooks = () => {
  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        const response = await AuthManager.signInAsync()
        // const token = await AuthManager.getAccessTokenAsync()

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
    // signOutAsync()
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

    /**
     *         setCalendarState({
          loadingEvents: response.loadingEvents,
          events: response.events,
        })

        dispatch({type: 'SIGN_IN', token: response.userToken})
     */

    // console.log('bootstrapAsync userToken', userToken)

    // dispatch({type: 'RESTORE_TOKEN', token: userToken})

    // if (!userToken) {
    //   signInAsync()
    // }
  }

  const loadUser = async () => {
    try {
      // Get the signed in user from Graph

      const user = await GraphManager.getUserAsync()

      if (user.error) {
        // If user token has expired, ask user to login again
        return signInAsync()
      }

      setUserState({
        userLoading: false,
        userFirstName: user.givenName,
        userFullName: user.displayName,
        userEmail: user.userPrincipalName,
        userTimeZone: user.mailboxSettings.timeZone || 'UTC',
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  const loadCalendar = async () => {
    try {
      // Get the signed in user from Graph

      const tz = userState.userTimeZone || 'UTC'

      const ianaTimeZone = findIana(tz)[4]

      // Get midnight on the start of the current week in the user's
      // time zone, but in UTC. For example, for PST, the time value
      // could be 07:00:00Z
      const startOfWeek = moment
        .tz(ianaTimeZone.valueOf())
        .startOf('week')
        .utc()

      const endOfWeek = moment(startOfWeek).add(7, 'day')

      let events = await GraphManager.getCalendarView(
        startOfWeek,
        endOfWeek,
        tz
      )

      events = events.value

      if (events == undefined) return

      let mappedData = events.map((event, index) => {
        return {
          start: moment(event.start.dateTime).format('HH:mm'),
          end: moment(event.end.dateTime).format('HH:mm'),
          // id: event.id,
          subject: event.subject,
          date: moment(event.start.dateTime).format('yyyy-MM-DD'),
        }
      })

      const reduced = mappedData.reduce((acc, currentItem) => {
        const {date, ...allTheRest} = currentItem

        acc[date] !== undefined
          ? acc[date].push(allTheRest)
          : (acc[date] = [allTheRest])

        return acc
      }, {})

      setCalendarState({
        loadingEvents: false,
        events: reduced,
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  return {
    state,
    userState,
    calendarState,
    bootstrapAsync,
    loadUser,
    loadCalendar,
    signInAsync,
    signOutAsync,
    authContext,
  }
}

export default calendarHooks
