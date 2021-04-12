import React from 'react'
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native'
import {Ionicons, MaterialIcons} from '@expo/vector-icons'
const CustomButtonIcon = ({onPress, title, iconOne, iconTwo}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={styles.iconTwoContainer}>
        <MaterialIcons name={iconOne} size={40} color="black" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <View style={styles.iconTwoContainer}>
        <MaterialIcons name={iconTwo} size={40} color="black" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    backgroundColor: '#E1F5FD',
    borderRadius: 5,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconTwoContainer: {
    width: 40,
    height: 40,
  },

  text: {
    fontSize: 20,
  },
})

export default CustomButtonIcon
