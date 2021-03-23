import React, {useEffect} from 'react'
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'

import {Agenda} from 'react-native-calendars'
import {Card} from 'react-native-paper'

import moment from 'moment-timezone'

import {AuthContext} from '../contexts/AuthContext'
import calendarHooks from './calendarHooks'

/**
 *
 * Currently dispalys events from a 7 day period.
 *
 */

export default ReactNativeCalendar = () => {
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
                  color: '#404040',
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
                  color: '#202020',
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

  const nothingPlanned = () => {
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
              <Text>Nothing planned.</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <Button
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
            return nothingPlanned()
          } else {
            return largeActivityIndicator()
          }
        }}
      />
    </AuthContext.Provider>
  )
}
