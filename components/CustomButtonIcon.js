import * as React from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import Icon from 'react-native-ionicons'

export const CustomButtonIcon = ({onPress, title, iconOne, iconTwo}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.container}>
        <Icon name={iconOne} size={40} color="26AAE2" />
        <View style={styles.buttonViewContainer}>
          <Text style={styles.buttonText}>{title}</Text>
          <Icon name={iconTwo} size={40} color="black" />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 100,
    overflow: 'hidden',
  },
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonViewContainer: {
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 30,
  },
  buttonText: {
    fontSize: 25,
    color: '#000000',
    alignSelf: 'center',
    textTransform: 'uppercase',
    marginRight: 20,
  },
})
