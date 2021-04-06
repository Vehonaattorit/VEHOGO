import React, {useState, useContext} from 'react'
import {StyleSheet, View, KeyboardAvoidingView} from 'react-native'
import {Button, Card, Item, Text} from 'native-base'
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
import {CompanyCode} from './CompanyCode'
import {CustomAlertDialog} from '../components/CustomAlertDialog'
import Toast, {DURATION} from 'react-native-easy-toast'
export const CreateCompany = ({navigation, setShowCreate, setShowBtns}) => {
  const [companyAddress, setAddress] = useState('')
  const [companyName, setName] = useState('')
  const {user} = useContext(UserContext)
  const [showCode, setShowCode] = useState(false)
  const [companyCode, setCompanyCode] = useState('')

  function getRandomString(length) {
    var randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var result = ''
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      )
    }
    return result
  }

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
      var route = ''
      var streetNumber = ''
      var postalCode = ''
      responseJson.results[0].address_components.forEach((element) => {
        if (element.types[0] === 'locality') {
          city = element.long_name
        }
        if (element.types[0] === 'route') {
          route = element.long_name
        }
        if (element.types[0] === 'street_number') {
          streetNumber = element.long_name
        }
        if (element.types[0] === 'postal_code') {
          postalCode = element.long_name
        }
      })

      const address = route + ' ' + streetNumber

      const data = {
        point: locationPoint,
        city: city,
        address: address,
        postalCode: postalCode,
      }
      console.log(data)

      return data
    } catch (e) {
      console.error(e)
    }
  }
  const sendCompanyData = async () => {
    if (companyAddress.length > 0 && companyName.length > 0) {
      const cCode = getRandomString(6)
      const data = await getCompanyGeoLocation()

      updateCompanyCity(data.city)
      const companyId = await updateCompany(
        new Company({
          address: data.address,
          displayName: companyName,
          userIDs: [user.id],
          location: data.point,
          city: data.city,
          companyCode: cCode,
          postalCode: data.postalCode,
        })
      )

      const companyUserData = {
        address: data.address,
        name: companyName,
        location: data.point,
        id: companyId,
      }

      user.company = companyUserData

      updateUser(user)

      console.log('data id', data)

      console.log('updated')
      setCompanyCode(cCode)
      setShowCode(true)
    } else {
      console.log('empty')
      Alert.alert('Wrong input!', 'Please fill in all the inputs.', [
        {text: 'Okay'},
      ])
      setError('Please fill in all the inputs.')
    }
  }

  return (
    <View style={styles.container}>
      {!showCode ? (
        <>
          <CustomTitle title="Company" />
          <Card style={styles.cardView}>
            <View style={styles.inputContainer}>
              <View style={styles.input}>
                <Input
                  placeholder="Company name"
                  value={companyName}
                  onChangeText={setName}
                />
              </View>
              <View style={styles.input}>
                <GooglePlacesInput
                  style={{alignSelf: 'stretch', borderRadius: 100}}
                  setAddress={setAddress}
                />
              </View>
            </View>
            <View style={styles.btnContainer}>
              <Button
                block
                style={styles.continue}
                onPress={() => {
                  sendCompanyData()
                }}
              >
                <Text style={styles.btnText}>Continue</Text>
              </Button>
              <Button
                block
                style={styles.cancel}
                onPress={() => {
                  setShowCreate(false)
                  setShowBtns(true)
                }}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </Button>
            </View>
          </Card>
        </>
      ) : (
        <CompanyCode
          navigation={navigation}
          companyCode={companyCode}
        ></CompanyCode>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    width: '90%',
    borderRadius: 30,
    padding: 30,
  },
  inputContainer: {
    margin: 5,
    marginBottom: 30,
    alignSelf: 'stretch',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 5,
    height: 45,
    padding: 5,
    borderRadius: 100,
    overflow: 'hidden',
  },
  btnContainer: {
    alignSelf: 'stretch',
  },
  continue: {
    backgroundColor: '#4FD966',
    margin: 5,
    borderRadius: 100,
  },
  cancel: {
    backgroundColor: '#FB3664',
    margin: 5,
    borderRadius: 100,
  },
  btnText: {
    color: '#000',
    fontSize: 24,
  },
})
