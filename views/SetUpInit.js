import React, {useContext} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {color} from '../constants/colors'

import {UserContext} from '../contexts'

export const SetUpInit = () => {
  const {user} = useContext(UserContext)

  console.log('SetupInit', user)

  return (
    <View style={styles.container}>
      <Text>Open up SetUpInit.js to start working on your app!</Text>
      <Text>Last view for setup</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
