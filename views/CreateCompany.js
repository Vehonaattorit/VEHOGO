import React, {useState, useContext, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
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

import {RadioButton, Text} from 'react-native-paper'

import CustomSimpleInput from '../components/CustomSimpleInput'

export const CreateCompany = ({navigation, setShowCreate, domain}) => {
  const [companyAddress, setAddress] = useState('')
  const [companyName, setName] = useState('')
  const {user} = useContext(UserContext)
  const [showCode, setShowCode] = useState(false)
  const [companyCode, setCompanyCode] = useState('')
  const [random, setRandom] = useState('')
  //radio button value
  const [value, setValue] = useState('code')

  useEffect(() => {
    setRandom(getRandomString(4))
  }, [])

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

  const setCompanyName = (companyName) => {
    setName(companyName)
    setCompanyCode(companyName.replace(/\s+/g, '') + '-' + random)
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

      return data
    } catch (e) {
      console.error(e)
    }
  }
  const sendCompanyData = async () => {
    if (companyAddress.length > 0 && companyName.length > 0) {
      const data = await getCompanyGeoLocation()

      let domainJoin
      if (value === 'both') {
        domainJoin = true
      } else {
        domainJoin = false
      }

      updateCompanyCity(data.city)
      const companyId = await updateCompany(
        new Company({
          address: data.address,
          displayName: companyName,
          userIDs: [user.id],
          location: data.point,
          city: data.city,
          companyCode: companyCode,
          postalCode: data.postalCode,
          domain: domain,
          domainJoin: domainJoin,
        })
      )

      const companyUserData = {
        address: data.address,
        name: companyName,
        location: data.point,
        id: companyId,
      }

      user.company = companyUserData

      await updateUser(user)

      setShowCode(true)
    } else {
    }
  }

  return (
    <View style={styles.container}>
      {!showCode ? (
        <>
          <View style={styles.inputContainer}>
            <Item>
              <CustomSimpleInput
                placeholder="Enter your company name ..."
                value={companyName}
                onChangeText={(event) => setCompanyName(event)}
                errorMessage={
                  companyName.length < 1 &&
                  'Company name must be at least 1 character long'
                }
              />
            </Item>
            <Item>
              <CustomSimpleInput
                placeholder="Enter your company join code ..."
                value={companyCode}
                onChangeText={setCompanyCode}
                errorMessage={
                  companyCode.length < 4 &&
                  'Company code must be at least 4 character long'
                }
              />
            </Item>
            <Item>
              <GooglePlacesInput setAddress={setAddress} />
            </Item>
            <RadioButton.Group
              onValueChange={(newValue) => setValue(newValue)}
              value={value}
            >
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 10,
                  marginTop: 5,
                  alignItems: 'center',
                }}
              >
                <RadioButton value="code" backgroundColor="red" />
                <Text style={{fontFamily: 'open-sans-regular'}}>
                  Only code joining
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 10,
                  alignItems: 'center',
                }}
              >
                <RadioButton value="both" />
                <Text>Allow domain joining</Text>
              </View>
            </RadioButton.Group>
          </View>
          <View style={styles.btnContainer}>
            <View style={styles.btns}>
              <CustomButtonIcon
                onPress={() => {
                  sendCompanyData()
                }}
                title="Continue"
                iconTwo="keyboard-arrow-right"
              />
            </View>
            <View style={styles.btns}>
              <CustomButtonIcon
                iconOne="keyboard-arrow-left"
                onPress={() => {
                  setShowCreate(false)
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
          domain={domain}
        ></CompanyCode>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'column',
    flex: 1.5,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  btnContainer: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 152,
    marginTop: 15,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 10
  },
  continueBtnContainer: {
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  cancelBtnContainer: {
    alignSelf: 'stretch',
  },

  btns: {
    alignSelf: 'stretch',
    margin: 5,
  },
})
