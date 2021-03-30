import React from 'react'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import {googleMapsApiKey} from '../secrets/secrets'
const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details)
      }}
      query={{
        key: googleMapsApiKey,
        language: 'en',
      }}
    />
  )
}

export default GooglePlacesInput
