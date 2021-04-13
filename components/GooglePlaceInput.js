import React, {useEffect, useRef} from 'react'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import {googleMapsApiKey} from '../secrets/secrets'
const GooglePlacesInput = ({setAddress, defaultValue}) => {
  const ref = useRef()

  useEffect(() => {
    ref.current?.setAddressText('Some Text')
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
          color: '#E1F5FD',
        },
        textInput: {
          height: 50,
          borderRadius: 10,
          color: '#000',
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
