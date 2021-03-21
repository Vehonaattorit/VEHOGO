import React, {
  SafeAreaView,
  useEffect,
  useState,
  useContext,
  useReducer,
} from 'react'
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native'
import {Agenda} from 'react-native-calendars'
import {Card, Avatar} from 'react-native-paper'

import {GraphManager} from './graph/GraphManager'
import moment from 'moment-timezone'
import {findIana} from 'windows-iana'

import {AuthContext} from '../contexts/AuthContext'
import {AuthManager} from '../auth/AuthManager'
import calendarHooks from './calendarHooks'

export default ReactNativeCalendar = () => {
  const {
    signInAsync,
    bootstrapAsync,
    authContext,
    loadCalendar,
    loadUser,
    state,
    userState,
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

  useEffect(() => {
    bootstrapAsync()
  }, [state.userToken, state.isSignOut, state.isLoading])

  useEffect(() => {
    if (!state.userToken) {
      loadUser()
      loadCalendar()
    }
  }, [])

  const renderEmptyData = () => {
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
      <Agenda
        items={calendarState.loadingEvents ? {} : calendarState.events}
        selected={moment(new Date()).format('yyyy-MM-DD')}
        renderItem={renderItem}
        // Specify what should be rendered instead of ActivityIndicator
        renderEmptyData={() => {
          return renderEmptyData()
        }}
      />
    </AuthContext.Provider>
  )
}
