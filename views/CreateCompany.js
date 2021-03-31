import React, {useState, useContext} from 'react'
import {StyleSheet, View, KeyboardAvoidingView} from 'react-native'
import {Button, Item, Text} from 'native-base'
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
import {updateCompanyCity} from '../controllers/companyCitiesController'

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
  const sendCompanyData = async () => {
    if (companyAddress.length > 0 && companyName.length > 0) {
      const data = await getCompanyGeoLocation()

      updateCompanyCity(data.city)
      const companyId = await updateCompany(
        new Company({
          address: companyAddress,
          displayName: companyName,
          userIDs: [user.id],
          location: data.point,
          city: data.city,
        })
      )

      const companyUserData = [
        {
          address: companyAddress,
          name: companyName,
          location: data.point,
          id: companyId,
        },
      ]
      user.company = companyUserData

      updateUser(user)

      console.log('data id', data)

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
        <Item>
          <Input
            placeholder="Company name"
            value={companyName}
            onChangeText={setName}
            errorMessage={
              companyName.length < 1 &&
              'Company name must be at least 1 character long'
            }
          />
        </Item>
        <Item>
          <GooglePlacesInput
            style={{alignSelf: 'stretch'}}
            setAddress={setAddress}
          />
        </Item>
      </View>
      <View style={styles.btnContainer}>
        <Button
          block
          style={styles.btns}
          onPress={() => {
            sendCompanyData()
          }}
        >
          <Text>Continue</Text>
        </Button>
        <Button
          block
          style={styles.btns}
          onPress={() => {
            setShowCreate(false)
            setShowBtns(true)
          }}
        >
          <Text>Cancel</Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    alignSelf: 'stretch',
  },
  btns: {
    margin: 5,
  },
})
