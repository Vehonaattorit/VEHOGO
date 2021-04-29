import React, {useEffect} from 'react'
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native'

import {Agenda, Calendar} from 'react-native-calendars'
import {Card} from 'react-native-paper'

import moment from 'moment-timezone'

import {AuthContext} from './contexts/AuthContext'
import calendarHooks from './calendarHooks'
import {color} from '../constants/colors'
import {GraphManager} from './graph/GraphManager'

// import AzureAuth from 'react-native-azure-auth'

// const azureAuth = new AzureAuth({
//   clientId: 'YOUR_CLIENT_ID',
// })

/**
 *
 * Currently dispalys events from a 7 day period.
 *
 */

export const OutlookCalendar = ({navigation}) => {
  const {
    state,
    bootstrapAsync,
    signOutAsync,
    signInAsync,
    authContext,
    calendarState,
  } = calendarHooks()

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
              <Text
                style={{
                  marginTop: 8,
                  marginBottom: 10,
                  color: color.darkBlue,
                }}
              >
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
              <Text
                style={{
                  fontSize: 16,
                  color: color.darkBlue,
                }}
              >
                {item.subject}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    bootstrapAsync()
  }, [])

  const largeActivityIndicator = () => {
    return (
      <View style={{top: 40, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const showEvents = () => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <Card>
          <Card.Content>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>
                {calendarState.events
                  ? 'Nothing planned.'
                  : 'Could not fetch events. Have you tried logging in?'}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.AndroidSafeArea}>
      <AuthContext.Provider value={authContext}>
        <Button
          color={color.darkBlue}
          title={state.userToken ? 'Sign out' : ' Log in'}
          onPress={state.userToken ? signOutAsync : signInAsync}
        />
        {/* 
        <Button
          color={color.darkBlue}
          title="Create Event"
          onPress={async () => {
            await GraphManager.createEvent({
              subject: "Let's go for lunch",
              body: {
                contentType: 'HTML',
                content: 'Does mid month work for you?',
              },
              start: {
                dateTime: '2021-04-15T11:34:51.434Z',
                timeZone: 'Pacific Standard Time',
              },
              end: {
                dateTime: '2021-04-15T13:34:51.434Z',
                timeZone: 'Pacific Standard Time',
              },
              location: {
                displayName: "Harry's Bar",
              },
              attendees: [
                {
                  emailAddress: {
                    address: 'adelev@contoso.onmicrosoft.com',
                    name: 'Adele Vance',
                  },
                  type: 'required',
                },
              ],
            })
          }}
        /> */}
        {/*  subject: 'Let\'s go for lunch',
  body: {
    contentType: 'HTML',
    content: 'Does mid month work for you?'
  },
  start: {
      dateTime: '2019-03-15T12:00:00',
      timeZone: 'Pacific Standard Time'
  },
  end: {
      dateTime: '2019-03-15T14:00:00',
      timeZone: 'Pacific Standard Time'
  },
  location: {
      displayName: 'Harry\'s Bar'
  },
  attendees: [
    {
      emailAddress: {
        address: 'adelev@contoso.onmicrosoft.com',
        name: 'Adele Vance'
      },
      type: 'required'
    }
  ], */}

        <Agenda
          onRefresh={bootstrapAsync}
          refreshing={calendarState.loadingEvents}
          items={calendarState.loadingEvents ? {} : calendarState.events}
          selected={moment(new Date()).format('yyyy-MM-DD')}
          renderItem={renderItem}
          // Specify what should be rendered instead of ActivityIndicator
          renderEmptyData={() => {
            if (!calendarState.loadingEvents) {
              return showEvents()
            } else {
              return largeActivityIndicator()
            }
          }}
          theme={{
            monthTextColor: color.darkBlue,
            indicatorColor: color.darkBlue,
            textDayFontFamily: 'open-sans-regular',
            textMonthFontFamily: 'open-sans-regular',
            textDayHeaderFontFamily: 'open-sans-regular',
          }}
        />
      </AuthContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})
