import React, {useEffect, useState} from 'react'
import {Alert, StyleSheet} from 'react-native'
import {Text, View, Button} from 'native-base'
import {deleteRideRequest} from '../controllers/rideRequestController'
import {Stop} from '../models/stop'
import {updateWorkTrip} from '../controllers/workTripController'
import {getUser} from '../controllers/userController'
import {googleMapsApiKey} from '../secrets/secrets'
import {calculateDistance, drivingTime, getNextDayOfWeek} from '../utils/utils'
import {useWorkTripHooks} from '../hooks/useHooks'
import fire from '../firebase/fire'
import {color} from '../constants/colors'

// Env keys
import {apiKey} from '@env'

// Utils
import {checkWhatDayItIs} from '../utils/utils'
import {GraphManager} from './graph/GraphManager'
import {AuthManager} from './auth/AuthManager'
import AsyncStorage from '@react-native-community/async-storage'

const PassengerAcceptRefuseButton = (props) => {
  const {user, workTrip, rideRequest, navigation} = props

  const {updateTodayDriverRides, setDriverTripList} = useWorkTripHooks(user)

  const getTripRoute = async (waypoints) => {
    try {
      const origin = workTrip.scheduledDrive.stops[0].location
      const destination =
        workTrip.scheduledDrive.stops[workTrip.scheduledDrive.stops.length - 1]
          .location
      var waypointsString = ''
      if (waypoints.length > 0) {
        waypointsString = '&waypoints='
        waypoints.forEach((waypoint) => {
          waypointsString += `${waypoint.location.latitude},${waypoint.location.longitude}|`
        })
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&${waypointsString}&key=${googleMapsApiKey}`,
        {
          method: 'GET',
          //Request Type
        }
      )

      const responseJson = await response.json()

      const data = responseJson

      return data
    } catch (e) {
      console.error(e)
    }
  }

  const acceptPassenger = async () => {
    let route

    // Get passenger data
    const passengerUser = await getUser(rideRequest.senderID)

    console.log(`Accepting passenger : ${rideRequest.senderID}`)

    let workTripToUpdate = workTrip

    if (workTripToUpdate.scheduledDrive.stops.length > 2) {
      var tempStops = workTripToUpdate.scheduledDrive.stops
      var waypoints = tempStops.slice(1, tempStops.length - 1)
      waypoints.push({
        location: rideRequest.homeLocation,
        address: rideRequest.homeAddress,
        stopName: passengerUser.userName,
        userID: rideRequest.senderID,
      })
      //calculates distances between origin and stop locations
      waypoints.forEach((waypoint) => {
        var firstStop = workTripToUpdate.scheduledDrive.stops[0]
        waypoint.distanceFromOrigin = calculateDistance(
          firstStop.location.latitude,
          firstStop.location.longitude,
          waypoint.location.latitude,
          waypoint.location.longitude
        )
      })
      //waypoints sorted by distance between origin
      waypoints.sort(function (origin, stop) {
        return origin.distanceFromOrigin - stop.distanceFromOrigin
      })

      route = await getTripRoute(waypoints)
      //add old first and last stops to the new array
      waypoints.unshift(workTripToUpdate.scheduledDrive.stops[0])
      waypoints.push(
        workTripToUpdate.scheduledDrive.stops[
          workTripToUpdate.scheduledDrive.stops.length - 1
        ]
      )

      //update the stops to the data model before saving to firestore
      workTripToUpdate.scheduledDrive.stops = waypoints
    } else {
      route = await getTripRoute([
        {
          location: rideRequest.homeLocation,
          address: rideRequest.homeAddress,
          stopName: passengerUser.userName,
          userID: rideRequest.senderID,
        },
      ])
      workTripToUpdate.scheduledDrive.stops.splice(
        1,
        0,
        new Stop({
          location: rideRequest.homeLocation,
          address: rideRequest.homeAddress,
          stopName: passengerUser.userName,
          userID: rideRequest.senderID,
        })
      )
    }

    workTripToUpdate.route = route

    let totalTime = 0
    route.routes[0].legs.map((leg) => {
      totalTime += leg.duration.value
    })
    totalTime = parseFloat(totalTime.toFixed(0))

    const end = workTripToUpdate.scheduledDrive.end.toDate()
    const start = workTripToUpdate.scheduledDrive.start.toDate()

    //Changing the worktrip start and end time acording to trip length
    workTripToUpdate.goingTo == 'work'
      ? (workTripToUpdate.scheduledDrive.start = new Date(
          end.getTime() - totalTime * 1000
        ))
      : (workTripToUpdate.scheduledDrive.end = new Date(
          start.getTime() + totalTime * 1000
        ))

    const newEndTime =
      workTripToUpdate.goingTo == 'work'
        ? workTripToUpdate.scheduledDrive.end.toDate()
        : workTripToUpdate.scheduledDrive.end
    //Having to do some toDate fuckery because of js is stupid
    const newStartTime =
      workTripToUpdate.goingTo == 'work'
        ? workTripToUpdate.scheduledDrive.start
        : workTripToUpdate.scheduledDrive.start.toDate()

    //looping through stops and calculating the time it takes to get to each stop
    for (
      let index = 0;
      index < workTripToUpdate.scheduledDrive.stops.length - 1;
      index++
    ) {
      let minutesToDestination = 0
      for (let a = 0; a < index; a++) {
        console.log(
          'adding minutes to destination',
          route.routes[0].legs[a].duration.text
        )
        minutesToDestination += route.routes[0].legs[a].duration.value
      }
      minutesToDestination = parseFloat(minutesToDestination.toFixed(0))

      workTripToUpdate.scheduledDrive.stops[
        index
      ].estimatedArrivalTime = new Date(
        newStartTime.getTime() + minutesToDestination * 1000
      )
      console.log(
        'Estimated time to arrive',
        index,
        workTripToUpdate.scheduledDrive.stops[index].estimatedArrivalTime
      )
    }
    let token = await fire.auth().currentUser.getIdTokenResult()
    const response = await fetch(
      `https://us-central1-veho-go.cloudfunctions.net/addWorkTripToUser`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: rideRequest.senderID,
          idToken: token.token,
          workTrip: workTripToUpdate,
        }),
      }
    )

    console.log('updating worktrip', workTripToUpdate.id)
    await updateWorkTrip(user.company.id, workTripToUpdate)
    await deleteRideRequest(user.company.id, rideRequest.id)

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: passengerUser.expoToken,
        title: 'Request was accepted.',
        body: `Request was accepted by ${user.userName}`,
      }),
    })

    navigation.popToTop()
  }

  const refusePassenger = async () => {
    deleteRideRequest(user.company.id, rideRequest.id)

    const passengerUser = await getUser(rideRequest.senderID)

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        to: passengerUser.expoToken,
        title: 'Request was refused',
        body: `Request was refused by ${user.userName}`,
      }),
    })

    navigation.popToTop()
  }

  return (
    <View style={styles.buttons}>
      <Button
        onPress={acceptPassenger}
        large
        style={{...styles.button, backgroundColor: color.malachiteGreen}}
      >
        <Text style={styles.btntxt}>Accept</Text>
      </Button>
      <Button
        onPress={refusePassenger}
        large
        style={{...styles.button, backgroundColor: color.radicalRed}}
      >
        <Text style={styles.btntxt}>Refuse</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttons: {
    backgroundColor: color.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  btntxt: {
    fontFamily: 'open-sans-regular',
    color: 'white',
  },
  item: {
    backgroundColor: '#26aae2',
  },
})

export default PassengerAcceptRefuseButton
