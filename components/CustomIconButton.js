import React from 'react'
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native'

const CustomButtonIcon = ({onPress, title}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  button: {
    height: 60,
    backgroundColor: '#E1F5FD',
    borderRadius: 5,
    marginHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
  },
})


export default CustomButtonIcon
