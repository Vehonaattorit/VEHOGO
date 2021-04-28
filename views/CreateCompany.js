import React, {useState, useContext, useEffect} from 'react'
import {StyleSheet, View, TextInput} from 'react-native'
import {Item, Input, Card, CardItem} from 'native-base'
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

export const CreateCompany = ({navigation, setShowCreate, domain, setShowBtns}) => {
  const [companyAddress, setAddress] = useState('')
  const [companyName, setName] = useState('')
  const {user} = useContext(UserContext)
  const [showCode, setShowCode] = useState(false)
  const [companyCode, setCompanyCode] = useState('')
  const [random, setRandom] = useState('')
  const [error, setError] = useState('')
  //radio button value
  const [value, setValue] = useState('code')

  useEffect(() => {
    setRandom(getRandomString(6))
    navigation.setOptions({
      title: 'Create Company',
    })
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
    if (companyAddress.length > 0 && companyName.length > 0 && companyCode.length > 6) {
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
      setError('Some inputs are not valid, address must be chosen, code must be min 7 characters and company name min 1 character.')
      console.log('no names or address')
    }
  }

  return (
    <View style={styles.container}>
      {!showCode ? (
        <>
          <Item>
            <GooglePlacesInput setAddress={setAddress} />
          </Item>
          <Item>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your company name ..."
                value={companyName}
                onChangeText={(event) => setCompanyName(event)}
              />
            </View>
          </Item>
          <Item>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your company join code ..."
                value={companyCode}
                onChangeText={setCompanyCode}
              />
            </View>
          </Item>
          {error != '' &&
            <Text style={{alignSelf: 'center', color: 'red', marginTop: 8}}>{error}</Text>
          }


          <View style={styles.radioView}>
            <RadioButton.Group
              onValueChange={(newValue) => setValue(newValue)}
              value={value}
            >
              <Text style={{justifyContent: 'center', fontFamily: 'open-sans-regular'}}>Can new users join this company with email / domain? </Text>
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
                <Text style={{fontFamily: 'open-sans-regular'}}>Allow domain joining</Text>
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
          domain={domain}
          value={value}
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
    marginTop: 10
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

  inputContainer: {
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    alignItems: 'center',
    backgroundColor: '#E1F5FD',
    width: '100%',
    borderRadius: 5,
    marginTop: 5,
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

  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15.5,
    fontSize: 15.5,
    borderRadius: 5,
    height: 50
  },

  radioView: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#E1F5FD',
    padding: 10,
    borderRadius: 10
  }
})
