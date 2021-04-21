import React, {useReducer, useState, useEffect} from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'


const CustomSimpleInput = (props) => {

  return (
    <>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          style={styles.input}
          onChangeText={props.onChangeText}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
  },
  inputContainer: {
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    alignItems: 'center',
    backgroundColor: '#E1F5FD',
    width: '100%',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#E1F5FD',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  icon: {
    margin: 10,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15.5,
    fontSize: 15.5,
    borderRadius: 5,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
  },
})

export default CustomSimpleInput
