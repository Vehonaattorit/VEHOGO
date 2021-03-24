import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { color } from '../constants/colors'

export const RoundButton = ({onPress, title}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.roundButton}
    >
      <Text style={styles.titleText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton: {
    width: 50,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    borderRadius: 100,
    backgroundColor: color.secondaryDark,
    margin: 3
  },

  titleText:{
    color: color.pText
  }
})
