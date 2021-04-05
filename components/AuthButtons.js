import React from 'react'
import {TouchableOpacity, StyleSheet, Text, Platform} from 'react-native'

export const AuthButtons = ({onPress, title, ...touchProps}) => {
  return (
    <TouchableOpacity
      {...touchProps}
      onPress={onPress}
      style={styles.buttonContainer}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#26AAE2',
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: 'black',
    textTransform: 'uppercase',
  },
})
