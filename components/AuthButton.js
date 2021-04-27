import React from 'react'
import {TouchableOpacity, StyleSheet, Text, Platform} from 'react-native'
import {color} from '../constants/colors'

export const AuthButton = ({onPress, testID, title, type, width}) => {
  const defaultButton = type == undefined || type == 'elevated'
  const textButton = type == 'text'

  return (
    <TouchableOpacity
      onPress={onPress}
      testID={testID}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: textButton ? 'transparent' : color.lightBlack,
        paddingHorizontal: textButton ? 35 : 40,
        paddingVertical: textButton ? 5 : 10,
        width: width ?? width,
      }}
    >
      <Text
        style={{
          fontSize: textButton ? 18 : 16,
          paddingHorizontal: textButton ? 5 : 10,
          color: textButton ? color.greyText : 'white',
          textTransform: textButton ? 'none' : 'uppercase',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}
