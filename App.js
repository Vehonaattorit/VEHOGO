import React, {useContext} from 'react'
import {StyleSheet, SafeAreaView, Button, Text, View} from 'react-native'

// Outlook Calendar
import OutlookCalendar from './views/OutlookCalendar'
import ReactNativeCalendar from './views/ReactNativeCalendar'

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
  },
})
