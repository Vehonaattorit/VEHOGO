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
import GooglePlacesInput from '../components/GooglePlaceInput'
import {googleMapsApiKey} from '../secrets/secrets'
import firebase from 'firebase/app'
import CustomButtonIcon from '../components/CustomIconButton'

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
  console.log('api key in address', googleMapsApiKey)
  const {user} = useContext(UserContext)

  const [address, setAddress] = useState(user.homeAddress || '')

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

  const submitHandler = useCallback(async () => {
    if (
      !formState.formIsValid &&
      (address.length > 0 || formState.inputValues.city === '')
    ) {
      Alert.alert(
        'Wrong input!',
        'Please write an address and city which has at least 1 letter.',
        [{text: 'Okay'}]
      )
      return
    }

    const data = await getAddressGeoLocation()

    const {city} = formState.inputValues

    user.homeAddress = address
    user.city = city
    user.homeLocation = data.point

    updateUser(user)

    navigation.navigate('WorkingDays')
  }, [formState])

  const getAddressGeoLocation = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=fi&key=${googleMapsApiKey}`,
        {
          method: 'GET',
          //Request Type
        }
      )
      const responseJson = await response.json()

      const locationPoint = new firebase.firestore.GeoPoint(
        responseJson.results[0].geometry.location.lat,
        responseJson.results[0].geometry.location.lng
      )
      console.log(locationPoint)
      var city = ''
      responseJson.results[0].address_components.forEach((element) => {
        if (element.types[0] === 'locality') {
          city = element.long_name
        }
      })

      const data = {
        point: locationPoint,
        city: city,
      }
      console.log(data)

      return data
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <FontAwesome name="home" size={300} color='#26AAE2' />
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
        <GooglePlacesInput
          defaultValue={user.homeAddress}
          setAddress={setAddress}
        />
        <View style={styles.customInput}>
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
        </View>
      </KeyboardAvoidingView>

      <CustomButtonIcon
        style={styles.btn}
        title="Submit"
        onPress={submitHandler}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    bottom: 20,
    width: '90%',
    color: 'white',
  },
  customInput: {
    marginTop: 50,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
  },
  btnContainer: {},
  btn: {
    width: '100%',
  },
  icon: {
    marginBottom: 200,
  },
})
