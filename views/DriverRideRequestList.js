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
import {getUser} from '../controllers/userController'

export const DriverRideRequestList = ({navigation, dataArray}) => {
  const {user} = useContext(UserContext)
  const [rideRequests, setRideRequests] = useState(null)
  const [passengerTripData, setPassengerTripData] = useState(null)

  const getRideRequests = async () => {
    let requests = await rideRequestQuery(
      user.company.id,
      'driverID',
      '==',
      user.id
    )

    let newRideRequests = []
    for (let i = 0; i < requests.length; i++) {
      let passengerData = await getUser(requests[i].senderID)

      newRideRequests.push({
        ...requests[i],
        start: passengerData.preferedWorkingHours[0].workDayStart,
        end: passengerData.preferedWorkingHours[0].workDayEnd,
      })

      console.log('passengerData', passengerData)
    }

    setPassengerTripData()

    setRideRequests(newRideRequests)
  }
  useEffect(() => {
    getRideRequests()
  }, [])

  const viewRequest = async (rideRequest) => {
    let singleItem = await getWorkTrip(
      user.company.id,
      rideRequest.workTripRefID
    )

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
        user={user}
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
