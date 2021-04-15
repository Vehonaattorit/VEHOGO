import React, {useState, useContext} from 'react'
import {KeyboardAvoidingView, TextInput, StyleSheet, View} from 'react-native'
import {Item} from 'native-base'
import {googleMapsApiKey} from '../secrets/secrets'
import {updateCompany} from '../controllers/companyController'
import {Company} from '../models/company'
import {UserContext} from '../contexts'
import firebase from 'firebase/app'
import {updateUser} from '../controllers/userController'
import GooglePlacesInput from '../components/GooglePlaceInput'
import {updateCompanyCity} from '../controllers/companyCitiesController'
import {CompanyCode} from './CompanyCode'
import CustomButtonIcon from '../components/CustomIconButton'

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
        `https://maps.googleapis.com/maps/api/geocode/json?address=${companyAddress}&language=fi&key=${googleMapsApiKey}`,
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
      console.log('inputs empty')
    }
  }

  return (
    <View style={styles.container}>
      {!showCode ? (
        <>
          <View style={styles.inputContainer}>
            <View style={styles.companyNameInputContainer}>
              <TextInput
                placeholder="Company name"
                value={companyName}
                onChangeText={setName}
                style={styles.companyNameTextInput}
                errorMessage={
                  companyName.length < 1 &&
                  'Company name must be at least 1 character long'
                }
              />
            </View>
            <Item style={styles.companyAddressInputContainer}>
              <GooglePlacesInput setAddress={setAddress} />
            </Item>
          </View>
          <View style={styles.btnContainer}>
            <View style={styles.continueBtnContainer}>
              <CustomButtonIcon
                style={styles.btns}
                onPress={() => {
                  sendCompanyData()
                }}
                title="Continue"
                iconTwo="keyboard-arrow-right"
              />
            </View>
            <View style={styles.cancelBtnContainer}>
              <CustomButtonIcon
                iconOne="keyboard-arrow-left"
                style={styles.btns}
                onPress={() => {
                  setShowCreate(false)
                  setShowBtns(true)
                }}
                title="Cancel"
              />
            </View>
          </View>
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
  inputContainer: {
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyNameInputContainer: {
    alignSelf: 'stretch',
    width: '100%',
    borderRadius: 10,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1F5FD',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  companyNameTextInput: {
    fontSize: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 50,
    width: '100%',
  },
  companyAddressInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 63,
    marginTop: 15,
  },
  btnContainer: {
    marginTop: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'stretch',
  },
  continueBtnContainer: {
    alignSelf: 'stretch',
    marginBottom: 70,
  },
  cancelBtnContainer: {
    alignSelf: 'stretch',
  },
  btns: {
    margin: 5,
  },
})
