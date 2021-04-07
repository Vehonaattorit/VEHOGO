import React, {useEffect, useState} from 'react'
import {StyleSheet, Alert} from 'react-native'
import {Text, View, Button} from 'native-base'
import {
  rideRequestMultiQuery,
  updateRideRequest,
} from '../controllers/rideRequestController'
import {RideRequest} from '../models/rideRequest'
import {getUser} from '../controllers/userController'
import {getWorkTrip, getWorkTrips} from '../controllers/workTripController'

const PassengerRideRequestButton = ({user, workTrip}) => {
  const [ownerPushToken, setOwnerPushToken] = useState(null)
  const [isRequested, setIsRequested] = useState(null)

  console.log('ownerPushToken', ownerPushToken)

  useEffect(() => {
    const getOwnerPushtoken = async () => {
      const userDriver = await getUser(workTrip.driverID)

      setOwnerPushToken(userDriver.ownerPushToken)
    }

    const getDriverWorkTrips = async () => {
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

      setIsRequested(isRequested)
    }

    getOwnerPushtoken()
    getDriverWorkTrips()
  }, [])

  const requestRide = async () => {
    if (!isRequested) {
      console.log(
        `Requesting ride from company: ${user.company.id} worktrip ${workTrip.id} with user ${user.userName}`
      )
      console.log('starting update')

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
      console.log('finished update')

      setIsRequested(true)
    } else {
      Alert.alert(
        'Request already sent!',
        'Please wait for your request approval.',
        [{text: 'Okay'}]
      )
    }
  }

  return (
    <View style={styles.buttons}>
      <Button onPress={requestRide} large style={styles.button}>
        <Text style={styles.btntxt}>Request</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#26aae2',
    borderRadius: 15,
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
