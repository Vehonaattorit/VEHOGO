import React, {useState, useEffect, createContext, useContext} from 'react'
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Text,
  Button,
} from 'react-native'

import {GraphManager} from './graph/GraphManager'
import moment from 'moment-timezone'
import {findIana} from 'windows-iana'
import {FlatList, ScrollView} from 'react-native-gesture-handler'

// Azure Microsoft
// import * as MicrosoftGraph from '@microsoft/microsoft-graph-types'

// TODO: CalenarState context
// const CalendarState = createContext({
//   loadingEvents: true,
//   events: [],
// })

// Calendar END

const OutlookUser = () => {
  const [state, setState] = useState({
    // TEMPORARY
    userLoading: true,
    userFirstName: 'Adele',
    userFullName: 'Adele Vance',
    userEmail: 'adelev@contoso.com',
    userTimeZone: 'UTC',
    // userPhoto: require('../images/no-profile-pic.png')
  })

  const [calendarState, setCalendarState] = useState({
    loadingEvents: true,
    events: [],
  })

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Get the signed in user from Graph
        console.log('Get the signed in user from Graph')
        const user = await GraphManager.getUserAsync()

        console.log('graphmanager user', user)
        console.log('graphmanager given name', user.givenName)
        console.log('graphmanager display name', user.displayName)
        console.log('graphmanager user timezone', user.mailboxSettings.timeZone)

        setState({
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

        const tz = state.userTimeZone || 'UTC'

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

        const events = await GraphManager.getCalendarView(
          startOfWeek,
          endOfWeek,
          tz
        )

        console.log('events', events)

        setCalendarState({
          loadingEvents: false,
          events: events.value,
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

    loadUser()

    loadCalendar()
  }, [])

  // const calendarState = useContext(CalendarState)

  const convertDateTime = (dateTime) => {
    return moment(dateTime).format('MMM Do H:mm a')
  }

  console.log('data', calendarState.events)

  return (
    <SafeAreaView style={styles.container}>
      <Text>Outlook User</Text>
      <Text>------------</Text>
      <Text>{state.userFullName}</Text>
      <Text>{state.userEmail}</Text>
      <Text>------------</Text>
      <Text>User is signed in</Text>

      <Text>Calendar events go below this text</Text>
      {/* <Modal visible={calendarState.loadingEvents}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={calendarState.loadingEvents}
            size="large"
          />
        </View>
      </Modal> */}
      {/* <ScrollView> */}
      {/* <Text>{JSON.stringify(calendarState.events, null, 2)}</Text> */}
      {/* </ScrollView> */}
      <FlatList
        data={calendarState.events}
        renderItem={({item}) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventSubject}>{item.subject}</Text>
            <Text style={styles.eventOrganizer}>
              {item.organizer.emailAddress.name}
            </Text>
            <Text style={styles.eventDuration}>
              {convertDateTime(item.start.dateTime)} -{' '}
              {convertDateTime(item.end.dateTime)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default OutlookUser

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventItem: {
    padding: 10,
  },
  eventSubject: {
    fontWeight: '700',
    fontSize: 18,
  },
  eventOrganizer: {
    fontWeight: '200',
  },
  eventDuration: {
    fontWeight: '200',
  },
})
