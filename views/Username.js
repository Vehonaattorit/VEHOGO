import React, {
  useEffect,
  useReducer,
  useCallback,
  useContext,
  useState,
} from 'react'
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
import {CustomButtonIcon} from '../components/CustomButtonIcon'
import {CustomSubmitButton} from '../components/CustomSubmitButton'

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
    if (!formState.formIsValid && formState.inputValues.userName === '') {
      Alert.alert(
        'Wrong input!',
        'Please create a username that has at least 1 letter.',
        [{text: 'Okay'}]
      )
      return
    }

    const {userName} = formState.inputValues

    user.userName = userName

    updateUser(user)

    navigation.navigate('Address')
  }

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      userName: user.userName ? user.userName : '',
    },
    inputValidities: {
      userName: user.userName ? true : false,
    },
    formIsValid: user.userName ? true : false,
  })

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      console.log('inputIdentifier', inputValue)

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
        <FontAwesome name="user" size={300} color={color.secondaryDark} />
      </View>
      <View style={styles.inputContainer}>
        <CustomInput
          placeholder="Username"
          initialValue={formState.inputValues.userName}
          keyboardType="default"
          autoCapitalize="sentences"
          id="userName"
          autoCorrect={false}
          onInputChange={inputChangeHandler}
          errorText="Please enter a valid username."
          minLength={1}
          required
        />
        <View style={styles.submitButton}>
          <CustomSubmitButton
            style={styles.btns}
            title="Submit"
            onPress={() => {
              submitHandler()
            }}
          />
        </View>
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
    backgroundColor: '#000000',
    borderTopLeftRadius: 62,
    borderTopRightRadius: 62,
    bottom: 0,
    width: '100%',
    padding: 20,
  },
  submitButton: {
    marginLeft: 100,
  },
  icon: {
    marginBottom: 100,
  },
})
