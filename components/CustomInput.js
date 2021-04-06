import React, {useReducer, useState, useEffect} from 'react'
import {View, Text, TextInput, StyleSheet, Icon} from 'react-native'

import {Input} from 'react-native-elements'

const INPUT_CHANGE = 'INPUT_CHANGE'

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      }

    default:
      return state
  }
}

const CustomInput = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
  })

  const [isError, setIsError] = useState(false)

  const {onInputChange, id} = props

  const textChangeHandler = (text) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let isValid = true
    setIsError(false)

    if (props.required && text.trim().length === 0) {
      isValid = false
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false
      setIsError(true)
    }
    if (props.min != null && +text < props.min) {
      isValid = false
      setIsError(true)
    }
    if (props.max != null && +text > props.max) {
      isValid = false
      setIsError(true)
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false
      setIsError(true)
    }
    onInputChange(id, text, isValid)

    dispatch({type: INPUT_CHANGE, value: text, isValid: isValid})
  }

  return (
    <>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.inputContainer}>
        <Input
          {...props}
          style={styles.input}
          value={inputState.value}
          onChangeText={textChangeHandler}
        />
      </View>
      {isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
  },
  label: {
    marginVertical: 8,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 100,
    marginTop: 20,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 50,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
  },
})

export default CustomInput
