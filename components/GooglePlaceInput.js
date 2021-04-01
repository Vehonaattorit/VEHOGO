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
        types: 'address'
      }}
    />
  )
}

export default GooglePlacesInput
