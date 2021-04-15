import React, {useEffect, useRef} from 'react'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import {googleMapsApiKey} from '../secrets/secrets'
const GooglePlacesInput = ({setAddress, defaultValue}) => {
  const ref = useRef()

  useEffect(() => {
    ref.current?.setAddressText('Some Text')
    console.log(ref.current?.getAddressText())
  }, [])

  return (
    <GooglePlacesAutocomplete
      placeholder={defaultValue || 'Search address'}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        setAddress(data.description)
      }}
      query={{
        key: googleMapsApiKey,
        language: 'en',
        types: 'address',
      }}
      styles={{
        textInputContainer: {
          backgroundColor: '#E1F5FD',
          paddingHorizontal: 5,
          borderRadius: 5,
          shadowColor: '#000',
          borderRadius: 10,
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
          borderRadius: 10,
          height: 50,
          color: '#5d5d5d',
          fontSize: 16,
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
      }}
    />
  )
}

export default GooglePlacesInput
