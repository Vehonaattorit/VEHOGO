import React, {useState, useEffect} from 'react'
import {View} from 'react-native'
import MainStackNavigator from './navigators/Navigator'

export default function App() {
  return (
    <View style={{flex: 1}}>
    <MainStackNavigator />

    </View>
  )
}
