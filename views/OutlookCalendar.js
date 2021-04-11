import React, {useEffect} from 'react'
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native'

import {Agenda, Calendar} from 'react-native-calendars'
import {Card} from 'react-native-paper'

import moment from 'moment-timezone'

import {AuthContext} from './contexts/AuthContext'
import calendarHooks from './calendarHooks'
import {color} from '../constants/colors'

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

  console.log('calendar state events', calendarState.events)

  return (
    <View style={styles.AndroidSafeArea}>
      <AuthContext.Provider value={authContext}>
        <Button
          color={color.darkBlue}
          title={state.userToken ? 'Sign out' : ' Log in'}
          onPress={state.userToken ? signOutAsync : signInAsync}
        />

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
