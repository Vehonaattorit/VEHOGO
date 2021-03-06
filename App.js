import React, {useState, useRef, useEffect} from 'react'
import {View, SafeAreaView, Platform, Text} from 'react-native'
import MainStackNavigator from './navigators/MainNavigator'
import AuthStackNavigator from './navigators/AuthenticationNavigator'
import SetUpStackNavigator from './navigators/SetUpNavigator'
import AppLoading from 'expo-app-loading'
import {UserContext} from './contexts'
import {getUser, userStream} from './controllers/userController'
import {signOut, subscribeToAuth} from './controllers/LoginController'
import * as Font from 'expo-font'
import {useDocumentData} from 'react-firebase-hooks/firestore'

import {LogBox} from 'react-native'

import * as Notifications from 'expo-notifications'

import * as Linking from 'expo-linking'

const prefix = Linking.makeUrl('/')

// Web build crashes if LogBox is used
if (Platform.OS !== 'web') {
  LogBox.ignoreLogs(['Setting a timer'])
}

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {shouldShowAlert: true}
  },
})

export default function App() {
  const [fontReady, setFontReady] = useState(false)
  const [userId, setUserId] = useState(null)

  const [data, setData] = useState(null)

  // Linking
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        MainPage: 'mainpage',
        OutlookCalendar: 'calendar',
      },
    },
  }

  const handleDeepLink = (event) => {
    let data = Linking.parse(event.url)

    setData(data)
  }

  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink)

    return () => {
      Linking.removeEventListener('url')
    }
  }, [])

  const loadFonts = async () => {
    await Font.loadAsync({
      'open-sans-regular': require('./assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-semi-bold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    })
    setFontReady(true)
  }

  useEffect(() => {
    subscribeToAuth(authStateChanged)
    loadFonts()
  }, [])

  const authStateChanged = (user) => {
    if (user !== null) {
      setUserId(user.uid)
    } else {
      setUserId(null)
    }
  }

  if (!fontReady) {
    return <AppLoading />
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Navigation linking={linking} userId={userId} />
    </SafeAreaView>
  )
}

function Navigation({userId, linking}) {
  if (userId == null) {
    return <AuthStackNavigator />
  } else {
    let userRef = userStream(userId)

    const [user] = useDocumentData(userRef)

    if (user != undefined) {
      // if setup is not completed

      if (
        user.city == undefined ||
        user.userName == undefined ||
        user.homeAddress == undefined ||
        user.travelPreference == undefined ||
        user.preferedWorkingHours == undefined ||
        user.setupIsCompleted == false ||
        user.setupIsCompleted == undefined
      ) {
        return (
          <UserContext.Provider value={{user}}>
            <SetUpStackNavigator />
          </UserContext.Provider>
        )
      } else {
        return (
          <UserContext.Provider value={{user}}>
            <MainStackNavigator linking={linking} />
          </UserContext.Provider>
        )
      }
    } else {
      return <View></View>
    }
  }
}
