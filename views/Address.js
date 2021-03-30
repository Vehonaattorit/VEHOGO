import React, {
  createContext,
  useCallback,
  useReducer,
  useContext,
  useState,
} from 'react'
import {StyleSheet, Alert, Text, View, KeyboardAvoidingView} from 'react-native'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {AntDesign, FontAwesome} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'
import {UserContext} from '../contexts'
import CustomInput from '../components/CustomInput'

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

export const Address = ({navigation}) => {
  const {user} = useContext(UserContext)

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      address: user ? user.homeAddress : '',
      city: user ? user.city : '',
    },
    inputValidities: {
      address: user ? true : false,
      city: user ? true : false,
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
    [dispatchFormState]
  )

  const submitHandler = useCallback(() => {
    if (
      !formState.formIsValid &&
      formState.inputValues.address === '' &&
      formState.inputValues.city === ''
    ) {
      Alert.alert(
        'Wrong input!',
        'Please write an address and city which have at least 1 letter.',
        [{text: 'Okay'}]
      )
      return
    }
    const {address, city} = formState.inputValues

    console.log('formState.inputValues', formState.inputValues)

    user.homeAddress = address
    user.city = city
    updateUser(user)

    navigation.navigate('WorkingDays')
  }, [formState])

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <CustomTitle title="Address" />
      <View style={styles.icon}>
        {Platform.OS === 'ios' ? (
          <AntDesign name="home" size={300} color={color.secondaryDark} />
        ) : (
          <FontAwesome name="home" size={300} color={color.secondaryDark} />
        )}
      </View>
      <View style={styles.inputContainer}>
        <CustomInput
          placeholder="Address"
          initialValue={user.homeAddress}
          keyboardType="default"
          autoCapitalize="sentences"
          returnKeyType="next"
          id="address"
          autoCorrect={false}
          onInputChange={inputChangeHandler}
          errorText="Please enter a valid address."
          minLength={1}
          required
        />
        <CustomInput
          placeholder="City"
          initialValue={user.city}
          keyboardType="default"
          autoCapitalize="sentences"
          returnKeyType="next"
          id="city"
          autoCorrect={false}
          onInputChange={inputChangeHandler}
          errorText="Please enter a valid city name."
          minLength={1}
          required
        />
        <CustomButton
          style={styles.btns}
          title="Submit"
          onPress={submitHandler}
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
