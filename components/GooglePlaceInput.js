import React, {useEffect, useRef} from 'react'

import {Platform} from 'react-native'

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import {googleMapsApiKey} from '../secrets/secrets'
import CustomInput from './CustomInput'
const GooglePlacesInput = ({setAddress, defaultValue}) => {
  const ref = useRef()

  useEffect(() => {
    ref.current?.setAddressText('Some Text')
  }, [])

  return (
    <>
      {Platform.OS === 'web' ? (
        <CustomInput
          testID="addressInput"
          placeholder="Please enter your address..."
          initialValue={defaultValue}
          keyboardType="default"
          autoCapitalize="sentences"
          id="userName"
          iconName="md-person"
          autoCorrect={false}
          onInputChange={(identifer, addressValue) => {
            setAddress(addressValue)
          }}
          errorText="Please enter a valid username."
          minLength={1}
          required
        />
      ) : (
        <GooglePlacesAutocomplete
          placeholder={defaultValue || 'Search address ...'}
          onPress={(data, details = null) => {
            console.log('data', data)
            setAddress(data.description)
          }}
          query={{
            key: googleMapsApiKey,
            language: 'en',
            types: 'address',
            components: 'country:fin'
          }}
          styles={{
            textInputContainer: {
              backgroundColor: '#E1F5FD',
              paddingHorizontal: 5,
              shadowColor: '#000',
              borderRadius: 5,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            textInput: {
              marginHorizontal: 6,
              marginTop: 5,
              borderRadius: 5,
              height: 50,
              color: '#5d5d5d',
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        />
      )}
    </>
  )
}

export default GooglePlacesInput
