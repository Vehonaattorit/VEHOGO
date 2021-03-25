import React, {useState, useEffect} from 'react'
import {View} from 'react-native'
import MainStackNavigator from './navigators/Navigator'
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import ChatRoom from './views/ChatRoom'
import {OutlookCalendar} from './views/OutlookCalendar'

import {Button} from 'react-native'

import firebase from './firebase/fire'
import {useAuthState} from 'react-firebase-hooks/auth'

import 'firebase/firestore'
import 'firebase/auth'
import {LogIn} from './views/LogIn'
import {SignUp} from './views/SignUp'
import {signOut} from './controllers/LoginController'

const auth = firebase.auth()
const firestore = firebase.firestore()

export default function App() {
  const [fontReady, setFontReady] = useState(false)

  const [user] = useAuthState(auth)

  const loadFonts = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    })
    setFontReady(true)
  }

  useEffect(() => {
    loadFonts()
  }, [])

  if (!fontReady) {
    console.log('Waiting for fonts...')
    return <AppLoading />
  }

  console.log('user', user)
  return (
    <View style={{flex: 1}}>
      {/* <LogIn /> */}
      {user ? <ChatRoom /> : <SignIn />}
      {/* <ChatRoom /> */}
      {/* <MainStackNavigator /> */}
    </View>
  )
}
