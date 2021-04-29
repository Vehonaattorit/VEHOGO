import React, {useEffect, useState} from 'react'
import {StyleSheet, Alert} from 'react-native'
import {Text, View, Button} from 'native-base'
import {
  rideRequestMultiQuery,
  updateRideRequest,
} from '../controllers/rideRequestController'
import {RideRequest} from '../models/rideRequest'
import {getUser} from '../controllers/userController'
import {color} from '../constants/colors'
// Env keys
import {apiKey} from '@env'
import {removePassengerFromRoute} from '../utils/passengerRemove'
import {updateUser} from '../controllers/userController'
import {PreferedWorkingHours} from '../models/preferedWorkingHours'

const PassengerRideRequestButton = ({
  user,
  navigation,
  isPassengerIncluded,
  workTrip,
}) => {
  const [expoToken, setExpoToken] = useState(null)
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  console.log('user in request', user);
  console.log('prefered', user.preferedWorkingHours)
  useEffect(() => {
    const getExpoToken = async () => {
      console.log('workTrip.driverID', workTrip.driverID)

      const userDriver = await getUser(workTrip.driverID)

      setExpoToken(userDriver.expoToken)
    }

    const getRequests = async () => {
      const isRequested = await rideRequestMultiQuery(user.company.id, [
        {
          field: 'senderID',
          condition: '==',
          value: user.id,
        },
        {
          field: 'workTripRefID',
          condition: '==',
          value: workTrip.id,
        },
      ])

      if (isRequested) {
        setAlreadyRequested(true)
        return
      }

      setAlreadyRequested(false)
    }

    getRequests()
    getExpoToken()
  }, [])

  const requestRide = async () => {
    if (!isPassengerIncluded && !alreadyRequested) {

      try {
        await updateRideRequest(
          user.company.id,
          new RideRequest({
            homeLocation: user.homeLocation,
            homeAddress: user.homeAddress,
            senderID: user.id,
            city: user.city,
            userName: user.userName,
            workTripRefID: workTrip.id,
            driverID: workTrip.driverID,
            workDayNum: workTrip.workDayNum,
          })
        )

        const hours = new Date().getHours()

        //search if preferedwrokinghours already contain requested workday
        let alreadyActive = false
        user.preferedWorkingHours.forEach(element => {
          if (element.workDayNum == workTrip.workDayNum) {
            alreadyActive = true
          }
        });
        console.log('alreadyActive or not', alreadyActive)
        //update preferedworkinghours if same worktrip.workdayNum not active


        if (user.preferedWorkingHours.length > 0) {

          if (alreadyActive == false) {

            let found = false;
            for (let i = 0; i < user.preferedWorkingHours.length; i++) {
              const workingHour = user.preferedWorkingHours[i];
              if (workTrip.workDayNum < workingHour.workDayNum) {
                user.preferedWorkingHours.splice(i, 0, {
                  workDayEnd: new Date(1970, 0, 1, hours + 1, 0),
                  workDayNum: workTrip.workDayNum,
                  workDayStart: new Date(1970, 0, 1, hours, 0),
                })
                found = true
                break
              }
            }
            if (!found) {
              user.preferedWorkingHours.push({
                workDayEnd: new Date(1970, 0, 1, hours + 1, 0),
                workDayNum: workTrip.workDayNum,
                workDayStart: new Date(1970, 0, 1, hours, 0),
              })


            }
          }
        } else {
          user.preferedWorkingHours = [{
            workDayEnd: new Date(1970, 0, 1, hours + 1, 0),
            workDayNum: workTrip.workDayNum,
            workDayStart: new Date(1970, 0, 1, hours, 0),
          }]
        }

        console.log('updated user', user)
        await updateUser(user)

      } catch (e) {
        console.log('ride request update failed', e)
      }



      console.log('2444, expoToken', expoToken)
      console.log('2333, apiKey', apiKey)

      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: expoToken,
          title: 'Request was sent',
          body: `Request sent from ${user.userName}`,
        }),
      })

      navigation.popToTop()

      Alert.alert(
        `Request was sent to ${workTrip.driverName}!`,
        'Please wait for your request approval.',
        [{text: 'Okay'}]
      )

      setAlreadyRequested(true)
    } else {
      Alert.alert(
        'Request already sent!',
        'Please wait for your request approval.',
        [{text: 'Okay'}]
      )
    }
  }

  /*const getTripRoute = async (waypoints) => {
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


  const removePassengerFromRoute = async(workTripUpdate, companyId) => {
    let route = []
    if (workTripUpdate.scheduledDrive.stops.length > 2) {
      console.log('more than 2 stops still left')
      var tempStops = workTripUpdate.scheduledDrive.stops
      var waypoints = tempStops.slice(1, tempStops.length - 1)

      //calculates distances between origin and stop locations
      waypoints.forEach((waypoint) => {
        var firstStop = workTripUpdate.scheduledDrive.stops[0]
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
      waypoints.unshift(workTripUpdate.scheduledDrive.stops[0])
      waypoints.push(
        workTripUpdate.scheduledDrive.stops[
        workTripUpdate.scheduledDrive.stops.length - 1
        ]
      )

    } else {
      //if there is only driver home and work just get route between those places
      //getTripRoute function has driver locations already defined
      route = await getTripRoute([])

    }
    workTripUpdate.route = route

    await updateWorkTrip(companyId, workTripUpdate)
    //setAlreadyRequested(true)
  }*/

  const cancelRide = async () => {
    if (!alreadyRequested) {
      let workTripUpdate

      // filter all stops that DON'T HAVE passenger ID
      const stops = workTrip.scheduledDrive.stops.filter(
        (item) => item.userID !== user.id
      )

      // new stops array without passenger stop
      workTripUpdate = {
        ...workTrip,
        scheduledDrive: {
          ...workTrip.scheduledDrive,
          stops: stops,
        },
      }
      // add available seat
      workTripUpdate.scheduledDrive.availableSeats += 1
      Alert.alert('Cancel ride', `Are you sure you want to cancel this ride?`, [
        {text: 'No', style: 'default'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await removePassengerFromRoute(
              workTripUpdate,
              user.company.id,
              workTrip
            )
            navigation.popToTop()
          },
        },
      ])
    } else {
      Alert.alert('Ride cancelled.', 'Ride has already been cancelled.', [
        {text: 'Okay'},
      ])
    }
  }

  return (
    <View style={styles.buttons}>
      <Button
        // disabled={isPassengerIncluded}
        // If passenger is not ONE of the stops -> request ride, else "cancel ride"
        onPress={!isPassengerIncluded ? requestRide : cancelRide}
        large
        style={{
          ...styles.button,
          backgroundColor: isPassengerIncluded
            ? color.radicalRed
            : color.darkBlue,
        }}
      >
        <Text style={styles.btntxt}>
          {isPassengerIncluded ? 'Cancel Ride' : 'Request'}
        </Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    justifyContent: 'center',
    backgroundColor: '#26aae2',
    borderRadius: 15,
    width: '100%',
  },
  buttons: {
    backgroundColor: color.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  btntxt: {
    fontFamily: 'open-sans-regular',
    alignContent: 'center',
    textAlign: 'center',
    color: 'white',
  },
  list: {
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#26aae2',
    borderRadius: 20,
  },
  item: {
    backgroundColor: '#26aae2',
  },
})

export default PassengerRideRequestButton
