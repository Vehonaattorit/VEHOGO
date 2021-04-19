import React, {useEffect, useState} from 'react'
import {StyleSheet, Alert} from 'react-native'
import {Text, View, Button} from 'native-base'
import {
  rideRequestMultiQuery,
  updateRideRequest,
} from '../controllers/rideRequestController'
import {RideRequest} from '../models/rideRequest'
import {getUser} from '../controllers/userController'
import {
  getWorkTrip,
  getWorkTrips,
  updateWorkTrip,
} from '../controllers/workTripController'
import {color} from '../constants/colors'

const PassengerRideRequestButton = ({
  user,
  navigation,
  isPassengerIncluded,
  workTrip,
}) => {
  const [ownerPushToken, setOwnerPushToken] = useState(null)
  const [alreadyRequested, setAlreadyRequested] = useState(false)

  useEffect(() => {
    const getOwnerPushToken = async () => {
      const userDriver = await getUser(workTrip.driverID)

      setOwnerPushToken(userDriver.ownerPushToken)
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
    getOwnerPushToken()
  }, [])

  const requestRide = async () => {
    if (!isPassengerIncluded && !alreadyRequested) {
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

      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: ownerPushToken,
          title: 'Request was sent',
          body: `Request sent from ${user.userName}`,
        }),
      })

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

  const cancelRide = async () => {
    if (!alreadyRequested) {
      console.log('cancelRide workTrip', workTrip.scheduledDrive.stops)
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
      // Remove available seat
      workTripUpdate.scheduledDrive.availableSeats -= 1

      Alert.alert('Cancel ride', `Are you sure you want to cancel this ride?`, [
        {text: 'No', style: 'default'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await updateWorkTrip(user.company.id, workTripUpdate)

            setAlreadyRequested(true)
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
    justifyContent: 'center',
    backgroundColor: '#26aae2',
    borderRadius: 15,
    width: '100%',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
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
