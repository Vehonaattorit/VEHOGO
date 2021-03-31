import * as React from 'react'
import {View, Button, StyleSheet, TouchableOpacity, Text} from 'react-native'
import Constants from 'expo-constants'
import Icon from 'react-native-ionicons'

export const CustomSubmitButton = ({onPress, title, iconOne}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.container}>
        <Text style={styles.buttonText}>{title}</Text>
        <Icon name={iconOne} size={40} color="white" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '50%',
    elevation: 8,
    backgroundColor: '#000000',
    borderRadius: '50%',
  },

  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },

  buttonText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
    marginRight: 15,
  },
})
