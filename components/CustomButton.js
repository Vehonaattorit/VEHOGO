import React from 'react'
import {TouchableOpacity, StyleSheet, Text, Platform} from 'react-native'
import {color} from '../constants/colors'

export const CustomButton = ({onPress, title}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    height: 40,
    borderWidth: 2,
    ...Platform.select({
      ios: {borderColor: color.secondaryDark, borderRadius: 20},
      android: {
        backgroundColor: color.secondaryDark,
        borderColor: 'rgba(52, 52, 52, 0.3)',
        borderRadius: 5,
      },
    }),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2AC062',
    shadowOpacity: 0.4,
    shadowOffset: {height: 10, width: 0},
    shadowRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    padding: 10,
    textTransform: 'uppercase',
    color: Platform.OS == 'ios' ? color.sText : color.pText,
  },
})
