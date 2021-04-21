import React, {useContext, useState} from 'react'
import {
  StyleSheet,
  Alert,
  Text,
  Platform,
  View,
  KeyboardAvoidingView,
} from 'react-native'

import {FontAwesome} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'
import {UserContext} from '../contexts'
import GooglePlacesInput from '../components/GooglePlaceInput'
import {googleMapsApiKey} from '../secrets/secrets'
import firebase from 'firebase/app'
import CustomButtonIcon from '../components/CustomIconButton'

export const Address = ({navigation}) => {
  const {user} = useContext(UserContext)

  const [address, setAddress] = useState(user.homeAddress || '')
  const [showSubmit, setShowSubmit] = useState(true)

  const submitHandler = async () => {
    if (address.length < 1) {
      Alert.alert(
        'Wrong input!',
        'Please write an address which has at least 1 letter.',
        [{text: 'Okay'}]
      )
      return
    }

    const data = await getAddressGeoLocation()

    user.homeAddress = address
    user.city = data.city
    user.homeLocation = data.point

    await updateUser(user)

    navigation.navigate('WorkingDays')
  }

  const getAddressGeoLocation = async () => {
    try {
      console.log(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=fi&key=${googleMapsApiKey}`
      )
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

      return data
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.icon}>
        <FontAwesome name="home" size={300} color="#26AAE2" />
      </View>
      <View style={styles.googleInputContainer}>
        <GooglePlacesInput
          setShowSubmit={setShowSubmit}
          showSubmit={showSubmit}
          defaultValue={user.homeAddress}
          setAddress={setAddress}
        />
      </View>
      <View style={styles.buttonContainer}>
        {showSubmit && (
          <CustomButtonIcon
            style={styles.btn}
            title="Submit"
            onPress={submitHandler}
            iconTwo="keyboard-arrow-right"
          />
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
  },
  googleInputContainer: {
    maxHeight: 300,
    width: '90%',
    minHeight: 95,
  },
  buttonContainer: {
    width: '100%',
    height: 100,
  },
})
