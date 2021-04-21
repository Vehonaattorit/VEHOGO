import React from 'react'
import {StyleSheet, Text, Platform} from 'react-native'
import {color} from '../constants/colors'
export const CustomTitle = ({title}) => {
  return <Text style={styles.text}>{title}</Text>
}
const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    color: "black",
  },
})
