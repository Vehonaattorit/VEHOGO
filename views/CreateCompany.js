import React, {useState, useContext} from 'react'
import {StyleSheet, View, KeyboardAvoidingView} from 'react-native'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {googleMapsApiKey} from '../secrets/secrets'
import {updateCompany} from '../controllers/companyController'
import {Company} from '../models/company'
import {UserContext} from '../contexts'
import firebase from 'firebase/app'

export const CreateCompany = ({navigation, setShowCreate, setShowBtns}) => {
  const [companyAddress, setAddress] = useState('')
  const [companyName, setName] = useState('')
  const {user} = useContext(UserContext)
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  const getCompanyGeoLocation = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${companyAddress}&key=${googleMapsApiKey}`,
        {
          method: 'GET',
          //Request Type
        }
      )
      const responseJson = await response.json()
      console.log('fetched')
      console.log(responseJson)
      const point = new firebase.firestore.GeoPoint(
        responseJson.results[0].geometry.location.lat,
        responseJson.results[0].geometry.location.lng
      )

      return point
    } catch (e) {
      console.error(e)
    }
  }

  const sendCompanyData = async () => {
    const point = await getCompanyGeoLocation()
    updateCompany(new Company({address: companyAddress, displayName: companyName, userIDs: [user.id], location: point}))
    console.log('updated')
    navigation.navigate('Travel')

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
          value={companyName}
          onChangeText={setName}
        />

        <Input placeholder="Address"
          value={companyAddress}
          onChangeText={setAddress}
        />

        <CustomButton
          style={styles.btns}
          title="Continue"
          onPress={() => {
            sendCompanyData()
          }}
        />
        <CustomButton
          title="Cancel"
          onPress={() => {
            setShowCreate(false)
            setShowBtns(true)
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
