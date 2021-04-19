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
import CustomButtonIcon from '../components/CustomIconButton'
import {Ionicons} from '@expo/vector-icons'

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
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons name="md-person" size={300} color="#26AAE2" />
      </View>
      <KeyboardAvoidingView behavior="position" style={styles.buttonAndInput}>
        <View style={styles.inputContainer}>
          <CustomInput
            placeholder="Please enter your full name..."
            initialValue={formState.inputValues.userName}
            keyboardType="default"
            autoCapitalize="sentences"
            id="userName"
            iconName="md-person"
            autoCorrect={false}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid username."
            minLength={1}
            required
          />
        </View>
        <CustomButtonIcon
          style={styles.btns}
          title="Submit"
          onPress={() => {
            submitHandler()
          }}
          iconTwo="keyboard-arrow-right"
        />
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonAndInput: {
    flex: 0.4,
    alignSelf: 'stretch',
  },
  inputContainer: {
    alignSelf: 'stretch',
    color: 'white',
    marginHorizontal: 20,
  },

  icon: {
    flex: 1.3,
    paddingTop: 20,
  },
})
