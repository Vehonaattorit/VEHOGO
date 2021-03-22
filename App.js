import {StyleSheet, Platform, SafeAreaView, StatusBar} from 'react-native'

// Outlook Calendar
import ReactNativeCalendar from './views/ReactNativeCalendar'

import * as React from 'react'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ReactNativeCalendar />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})
