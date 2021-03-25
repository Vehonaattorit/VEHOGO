import React, {useState, useEffect} from 'react'
import {View} from 'react-native'
import MainStackNavigator from './navigators/MainNavigator'
import AuthStackNavigator from './navigators/AuthenticationNavigator'
import SetUpStackNavigator from './navigators/SetUpNavigator'
import AppLoading from 'expo-app-loading'
import {UserContext, UserProvider} from './contexts'
import {userStream} from './controllers/userController'
import {signOut, subscribeToAuth} from './controllers/LoginController'
import * as Font from 'expo-font'
import {useDocumentData} from 'react-firebase-hooks/firestore'
import {useCardAnimation} from '@react-navigation/stack'
import {User, userConverter} from './models/user'
import {addChat, getChat} from './controllers/chatRoomController'

import {ChatRoom} from './models/chatRoom'
import {addMessage} from './controllers/chatMessageController'
import {ChatMessage} from './models/chatMessage'

export default function App() {
  const [fontReady, setFontReady] = useState(false)
  const [userId, setUserId] = useState(null)

  // addChat(
  //   new ChatRoom({
  //     driverId: 'OqXojv1V87gwvJZWHmt2bFVOmuq2',
  //     passengerId: 'OzNfqPF8izfpOpmIyPdjsv27LUQ2',
  //     latestMessage: {
  //       text: 'Test message',
  //       createdAt: new Date().getTime(),
  //     },
  //   })
  // )

  // addMessage(
  //   new ChatMessage({
  //     id: '5DYeiEWumLIpVR7hpYZ3',
  //     text: 'Tämä on testiviesti 101',
  //     createdAt: new Date().getTime(),
  //     user: {
  //       _id: '5DYeiEWumLIpVR7hpYZ3',
  //       email: 'test@test.com',
  //     },
  //   })
  // )

  // signOut()
  const loadFonts = async () => {
    await Font.loadAsync({
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
    console.log('Waiting for fonts...')
    return <AppLoading />
  }

  return (
    <View style={{flex: 1}}>
      <Navigation userId={userId} />
    </View>
  )
}

function Navigation({userId}) {
  if (userId == null) {
    return <AuthStackNavigator />
  } else {
    let userRef = userStream(userId)
    const [user] = useDocumentData(userRef)

    if (user != undefined) {
      // if setup is not completed

      if (
        user.userName == undefined ||
        user.homeLocation == undefined ||
        user.homeAddress == undefined ||
        user.workDays == undefined ||
        user.travelPreference == undefined
      ) {
        return (
          <UserContext.Provider value={{user}}>
            <SetUpStackNavigator />
          </UserContext.Provider>
        )
      } else {
        return (
          <UserContext.Provider value={{user}}>
            <MainStackNavigator />
          </UserContext.Provider>
        )
      }
    } else {
      return <View></View>
    }
  }
}
