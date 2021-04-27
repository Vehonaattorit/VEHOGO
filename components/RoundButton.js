import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {color} from '../constants/colors'

export const RoundButton = ({toggleHandler, item, isSelected, testID}) => {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={() => toggleHandler(item, !isSelected)}
      style={{
        ...styles.roundButton,
        backgroundColor: isSelected ? '#26AAE2' : '#E1F5FD',
      }}
    >
      <Text style={styles.titleText}>{item.weekDay}</Text>
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
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    borderRadius: 10,
    backgroundColor: '#E1F5FD',
    margin: 3,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
  },

  titleText: {
    color: 'black',
    fontSize: 20,
  },
})
