import React, {
  SafeAreaView,
  useEffect,
  useState,
  useContext,
  useReducer,
} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native'
import {Agenda} from 'react-native-calendars'
import {Card, Avatar} from 'react-native-paper'

import {GraphManager} from './graph/GraphManager'
import moment from 'moment-timezone'
import {findIana} from 'windows-iana'

import {AuthContext} from '../contexts/AuthContext'
import {AuthManager} from '../auth/AuthManager'
import AsyncStorage from '@react-native-community/async-storage'

// import {AuthContext} from '../contexts/AuthContext'

const timeToString = (time) => {
  const date = new Date(time)
  return date.toISOString().split('T')[0]
}

export default ReactNativeCalendar = () => {
  const [items, setItems] = useState({})

  const [calendarState, setCalendarState] = useState({
    loadingEvents: true,
    events: [],
  })

  const [userState, setUserState] = useState({
    // TEMPORARY
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

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>
                {item.start} - {item.end}
              </Text>
            </View>
          </Card.Content>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{item.subject}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    )
  }

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

  useEffect(() => {
    const bootstrapAsync = async () => {
      // let userToken = null
      const userToken = await AsyncStorage.getItem('userToken')

      console.log('bootstrap async', userToken)
      dispatch({type: 'RESTORE_TOKEN', token: userToken})

      console.log('RESTORE TOKEN', state.userToken)

      if (!userToken) {
        signInAsync()
      }
    }

    bootstrapAsync()
    // signInAsync()
  }, [state.userToken, state.isSignOut, state.isLoading])

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Get the signed in user from Graph
        console.log('Get the signed in user from Graph')
        const user = await GraphManager.getUserAsync()

        if (user.error) {
          // If user token has expired, ask user to login again
          signInAsync()
        }

        console.log('graphmanager user', user)
        console.log('graphmanager given name', user.givenName)
        console.log('graphmanager display name', user.displayName)
        console.log('graphmanager user timezone', user.mailboxSettings.timeZone)

        setUserState({
          userLoading: false,
          userFirstName: user.givenName,
          userFullName: user.displayName,
          userEmail: user.userPrincipalName,
          userTimeZone: user.mailboxSettings.timeZone,
        })
      } catch (err) {
        console.log(err)

        Alert.alert(
          'Error getting user',
          JSON.stringify(err),
          [
            {
              text: 'OK',
            },
          ],
          {cancelable: false}
        )
      }
    }

    const loadCalendar = async () => {
      try {
        // Get the signed in user from Graph
        console.log('Get the signed in user from Graph')

        const tz = userState.userTimeZone || 'UTC'

        console.log('tz timezone', tz)

        const ianaTimeZone = findIana(tz)[4]

        console.log('ianaTimeZone', ianaTimeZone)

        // Get midnight on the start of the current week in the user's
        // time zone, but in UTC. For example, for PST, the time value
        // could be 07:00:00Z
        const startOfWeek = moment
          .tz(ianaTimeZone.valueOf())
          .startOf('week')
          .utc()
        console.log('startOfWeek', startOfWeek)

        const endOfWeek = moment(startOfWeek).add(7, 'day')

        console.log('endOfWeek', endOfWeek)

        let events = await GraphManager.getCalendarView(
          startOfWeek,
          endOfWeek,
          tz
        )

        events = events.value
        console.log('events', events)

        const mappedData = events.map((event, index) => {
          console.log('date start', event.start.dateTime)
          console.log('date end', event.end.dateTime)
          console.log('id', event.id)
          console.log('subject', event.subject)

          return {
            start: moment(event.start.dateTime).format('HH:mm'),
            end: moment(event.end.dateTime).format('HH:mm'),
            // id: event.id,
            subject: event.subject,
            date: moment(event.start.dateTime).format('yyyy-MM-DD'),
          }
        })

        console.log('mappedData', mappedData)

        const reduced = mappedData.reduce((acc, currentItem) => {
          const {date, ...allTheRest} = currentItem

          console.log('reduced currentItem', currentItem)
          console.log('reduced allTheRest', allTheRest)
          console.log('accu', acc)
          console.log('acc[date]', acc[date])

          // acc[date] = [{...currentItem}]
          acc[date] = [allTheRest]
          // allThreRest is an object
          /** */
          // acc[date] = {...acc[date], allTheRest}
          // acc[date].push(allTheRest)

          return acc
        }, {})

        console.log('reduced data', reduced)

        setCalendarState({
          loadingEvents: false,
          events: reduced,
        })
      } catch (err) {
        console.log(err)

        Alert.alert(
          'Error getting calendar',
          JSON.stringify(err),
          [
            {
              text: 'OK',
            },
          ],
          {cancelable: false}
        )
      }
    }

    if (!state.userToken) {
      loadUser()
      loadCalendar()
    }
  }, [])

  if (!calendarState.loadingEvents) console.log('PERSEUS', calendarState.events)

  // const [testItems, setTestItems] = useState({
  //   '2020-03-21': [{subject: 'test 1', cookies: false}],
  //   '2020-03-22': [{subject: 'test 2', cookies: false}],
  // })

  const [testItems, setTestItems] = useState({
    '2021-03-21': [
      {
        subject: 'Test subject 05',
      },
      {
        subject: 'Test subject 03',
      },
    ],
  })

  return (
    <AuthContext.Provider value={authContext}>
      <Agenda
        items={calendarState.loadingEvents ? testItems : calendarState.events}
        // items={testItems}
        // loadItemsForMonth={loadItems}
        selected={moment(new Date()).format('yyyy-MM-DD')}
        renderItem={renderItem}
      />
    </AuthContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
