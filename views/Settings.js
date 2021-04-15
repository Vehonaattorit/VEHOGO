import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

export const Settings = () => {
  return (
    <View style={styles.container}>
      <Text>Settings view</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
  },
})
