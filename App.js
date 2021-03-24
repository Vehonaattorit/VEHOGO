import React, {useState, useEffect} from 'react'
import {View} from 'react-native'
import MainStackNavigator from './navigators/Navigator'
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import ChatRoom from './views/ChatRoom'

export default function App() {
  const [fontReady, setFontReady] = useState(false)

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
  return (
    <View style={{flex: 1}}>
      <ChatRoom />
    </View>
  )
}
