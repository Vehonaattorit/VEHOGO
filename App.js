import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {RidesView} from './views/rides_view'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <RidesView></RidesView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
