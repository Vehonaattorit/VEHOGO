import React from 'react'
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'
const CustomSingleIconButton = ({onPress, title, iconOne}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={iconOne} size={40} color="black" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    backgroundColor: '#E1F5FD',
    borderRadius: 5,
    margin: 5,
    marginHorizontal: 20,
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
    justifyContent: 'center',
    paddingLeft: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 20,
  },
})

export default CustomSingleIconButton
