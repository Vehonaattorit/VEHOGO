import React, {useState, useEffect, useRef, useContext} from 'react'
import {UserContext} from '../contexts'
import {FlatList} from 'react-native'
import {Text, View, Button} from 'native-base'
import {StyleSheet, Dimensions} from 'react-native'
import {rideRequestQuery} from '../controllers/rideRequestController'
import {getWorkTrip} from '../controllers/workTripController'
import {color} from '../constants/colors'
import moment from 'moment'
import RequestListItem from '../components/RequestListItem'

export const DriverRideRequestList = ({navigation, dataArray}) => {
  const {user} = useContext(UserContext)
  const [rideRequests, setRideRequests] = useState(null)

  const getRideRequests = async () => {
    let requests = await rideRequestQuery(
      user.company.id,
      'driverID',
      '==',
      user.id
    )

    setRideRequests(requests)
  }
  useEffect(() => {
    getRideRequests()
  }, [])

  const viewRequest = async (rideRequest) => {
    let singleItem = await getWorkTrip(
      user.company.id,
      rideRequest.workTripRefID
    )
    console.log('driverRideRequest single item', singleItem)
    if (singleItem == undefined) return
    navigation.navigate('RequestRide', {
      singleItem: singleItem,
      rideRequest: rideRequest,
    })
  }

  const renderGridItem = (itemData) => {
    return (
      <RequestListItem
        keyExtractor={({item}, index) => {
          return item.id
        }}
        viewRequest={viewRequest}
        itemData={itemData}
      />
    )
  }

  return (
    <FlatList
      data={rideRequests !== null ? rideRequests : null}
      renderItem={renderGridItem}
    />
  )
}
