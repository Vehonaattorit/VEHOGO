import React, {useContext} from 'react'
import {StyleSheet, Button, Text, View} from 'react-native'

// Outlook Calendar
import OutlookCalendar from './views/OutlookCalendar'

export default function App() {
  return (
    <View style={styles.container}>
      <OutlookCalendar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
