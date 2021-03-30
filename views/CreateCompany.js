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
import {updateUser} from '../controllers/userController'
import GooglePlacesInput from '../components/GooglePlaceInput'

export const CreateCompany = ({navigation, setShowCreate, setShowBtns}) => {
  const [companyAddress, setAddress] = useState('')
  const [companyName, setName] = useState('')
  const {user} = useContext(UserContext)

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
    if (companyAddress.length > 0 && companyName.length > 0) {
      const point = await getCompanyGeoLocation()
      updateCompany(
        new Company({
          address: companyAddress,
          displayName: companyName,
          userIDs: [user.id],
          location: point,
        })
      )

      const companyUserData = [
        {
          address: companyAddress,
          name: companyName,
          location: point,
        },
      ]
      console.log('updating user')
      user.company = companyUserData
      updateUser(user)

      console.log('updated')
      navigation.navigate('Travel')
    } else {
      console.log('inputs empty')
    }
  }

  return (
    <View style={styles.container}>
      <CustomTitle title="Company" />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Company name"
          value={companyName}
          onChangeText={setName}
          errorMessage={
            companyName.length < 1 &&
            'Company name must be at least 1 character long'
          }
        />
        {/* <Input
          placeholder="Address"
          value={companyAddress}
          onChangeText={setAddress}
          errorMessage={
            companyAddress.length < 1 &&
            'Company address must be at least 1 character long'
          }
        />  */}
        <GooglePlacesInput />
      </View>
      <View style={styles.btnContainer}>
        <CustomButton
          style={styles.btns}
          title="Continue"
          r
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
    flex: 2,
  },
  btnContainer: {
    flex: 1,
  },
})
