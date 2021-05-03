import React, {useEffect, useContext, useState} from 'react'
import {SafeAreaView, Alert, StyleSheet, FlatList} from 'react-native'
import {
  Content,
  Card,
  CardItem,
  Body,
  Container,
  View,
  Text,
  Icon,
  Button,
  Title,
} from 'native-base'
import {getCars} from '../controllers/carController'
// import ActiveRideListItem from '../components/ActiveRideListItem'
import {UserContext} from '../contexts'
import NewRideForm from './NewRideForm'

import PassengerPendingRequestItem from '../components/PassengerPendingRequstListItem'
import {
  deleteRideRequest,
  rideRequestQuery,
} from '../controllers/rideRequestController'
import {getUser} from '../controllers/userController'
import {getWorkTrip} from '../controllers/workTripController'

const PassengerPendingRequestsList = ({navigation, route}) => {
  const {user} = useContext(UserContext)
  const [rideRequests, setRideRequests] = useState(null)
  const [passengerTripData, setPassengerTripData] = useState(null)
  const [alreadyRequested, setAlreadyRequested] = useState(false)

  /**
 * // const getRideRequests = async () => {
  //   let ref = await rideRequestQuery(user.company.id, 'senderID', '==', user.id)

  //   let requests = []

  //   ref.onSnapshot(async (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       requests.push(doc.data())
  //     })

  //     let newRideRequests = []

  //     for (let i = 0; i < requests.length; i++) {
  //       let driverData = await getUser(requests[i].driverID)

  //       newRideRequests.push({
  //         ...requests[i],
  //         driverName: driverData.userName,
  //         driverAddress: driverData.homeAddress,
  //         driverHomeLocation: driverData.homeLocation,
  //         start: driverData.preferedWorkingHours[0].workDayStart,
  //         end: driverData.preferedWorkingHours[0].workDayEnd,
  //       })
  //     }


  //     console.log("newRideRequests[0]", newRideRequests[0]);
      
  //     setRideRequests(newRideRequests)
  //   })
  // }
 */

  const getRideRequests = async () => {
    let requests = await rideRequestQuery(
      user.company.id,
      'senderID',
      '==',
      user.id
    )

    let newRideRequests = []

    for (let i = 0; i < requests.length; i++) {
      let driverData = await getUser(requests[i].driverID)

      newRideRequests.push({
        ...requests[i],
        driverName: driverData.userName,
        driverAddress: driverData.homeAddress,
        driverHomeLocation: driverData.homeLocation,
        start: driverData.preferedWorkingHours[0].workDayStart,
        end: driverData.preferedWorkingHours[0].workDayEnd,
      })
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
      viewPendingRequest: true,
    })
  }

  const cancelRequest = (rideRequest) => {
    if (!alreadyRequested) {
      Alert.alert(
        'Remove request',
        `Are you sure you want to remove the pending request?`,
        [
          {text: 'No', style: 'default'},
          {
            text: 'Yes',
            style: 'destructive',
            onPress: async () => {
              setAlreadyRequested(true)

              console.log('rideRequest.id', rideRequest.id)

              const isDeleted = await deleteRideRequest(
                user.company.id,
                rideRequest.id
              )

              if (isDeleted)
                Alert.alert(`Pending request was removed.`, '', [
                  {text: 'Okay'},
                ])

              await getRideRequests()
            },
          },
        ]
      )
    } else {
      Alert.alert('Ride cancelled.', 'Ride has already been cancelled.', [
        {text: 'Okay'},
      ])
    }
  }

  const renderGridItem = (itemData) => {
    return (
      <PassengerPendingRequestItem
        keyExtractor={({item}, index) => {
          return item.id
        }}
        user={user}
        viewRequest={viewRequest}
        cancelRequest={cancelRequest}
        itemData={itemData}
      />
    )
  }

  return (
    <View style={styles.view}>
      <View style={styles.listView}>
        <FlatList
          data={rideRequests !== null ? rideRequests : null}
          renderItem={renderGridItem}
        />
      </View>
    </View>
  )
}

export default PassengerPendingRequestsList

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },

  listView: {
    flex: 1,
    margin: 10,
  },

  button: {
    marginTop: 10,
  },
})
