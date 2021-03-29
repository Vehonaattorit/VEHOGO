import React, {useReducer, useCallback, useContext, useState} from 'react'
import {StyleSheet, Alert, View, KeyboardAvoidingView} from 'react-native'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {AntDesign, FontAwesome} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'
import {UserContext} from '../contexts'
import CustomInput from '../components/CustomInput'
import {LongPressGestureHandler} from 'react-native-gesture-handler'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    }
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    }
    let updatedFormIsValid = true
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    }
  }
  return state
}

export const Username = ({navigation}) => {
  const {user} = useContext(UserContext)

  const submitHandler = () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {text: 'Okay'},
      ])
      return
    }

    const {userName} = formState.inputValues

    user.userName = userName

    updateUser(user)
  }

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      userName: user ? user.userName : '',
    },
    inputValidities: {
      userName: user ? true : false,
    },
    formIsValid: user ? true : false,
  })

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      })
    },
    [dispatchFormState, user]
  )

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <CustomTitle title="Select username" />
      <View style={styles.icon}>
        {Platform.OS === 'ios' ? (
          <AntDesign name="user" size={300} color={color.secondaryDark} />
        ) : (
          <FontAwesome name="user" size={300} color={color.secondaryDark} />
        )}
      </View>
      <View style={styles.inputContainer}>
        <CustomInput
          placeholder="Username"
          initialValue={user.userName}
          keyboardType="default"
          autoCapitalize="sentences"
          // returnKeyType="next"
          id="userName"
          autoCorrect={false}
          onInputChange={inputChangeHandler}
          errorText="Please enter a valid username."
          minLength={1}
          required
        />
        {/* <Input
          placeholder="Username"
          value={username}
          onChangeText={(value) => setUsername(value)}
        />
        <Text>{usernameError}</Text> */}

        <CustomButton
          style={styles.btns}
          title="Submit"
          onPress={() => {
            submitHandler()
            navigation.navigate('Address')
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 60,
    width: '90%',
    color: 'white',
  },
  icon: {
    marginBottom: 100,
  },
})
