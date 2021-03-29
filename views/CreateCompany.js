import React, {useState} from 'react'
import {StyleSheet, View, KeyboardAvoidingView} from 'react-native'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {googleMapsApiKey} from '../secrets/secrets'

export const CreateCompany = ({navigation}) => {
  const [location, setLocation] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  const getDataUsingGet = ({location}) => {
    //GET request
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${googleMapsApiKey}`,
      {
        method: 'GET',
        //Request Type
      }
    )
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        console.log(responseJson)
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        alert(JSON.stringify(error))
        console.error(error)
      })
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <CustomTitle title="Company" />
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name="home-account"
          size={300}
          color={color.secondaryDark}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Company name"
          value={location}
          onChangeText={setLocation}
        />

        <Input placeholder="Address" on />

        <CustomButton
          style={styles.btns}
          title="Continue"
          onPress={() => {
            navigation.navigate('')
            getDataUsingGet({location})
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
