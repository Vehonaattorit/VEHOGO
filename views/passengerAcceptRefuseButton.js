import React, {useEffect, useState} from 'react'
import {StyleSheet} from 'react-native'
import {Text, View, Button} from 'native-base'
import {deleteRideRequest} from '../controllers/rideRequestController'
import {RideRequest} from '../models/rideRequest'
import {Stop} from '../models/stop'
import {updateWorkTrip} from '../controllers/workTripController'
import {getUser} from '../controllers/userController'

const PassengerAcceptRefuseButton = (props) => {
  const {user, workTrip, rideRequest} = props
  const [ownerPushToken, setOwnerPushToken] = useState(null)

  useEffect(() => {
    getOwnerPushtoken()
  }, [])
  console.log('ownerPushToken', ownerPushToken)

  const getOwnerPushtoken = async () => {
    console.log('workTrip.senderiD', rideRequest)
    const passengerId = await getUser(rideRequest.senderID)

    console.log('user driver', passengerId)

    setOwnerPushToken(passengerId.ownerPushToken)
  }

  // ExponentPushToken[CpFu1GOw98cSB0zqFWSOVC]
  const acceptPassenger = async () => {
    console.log('workTrip object', workTrip)
    console.log(`Accepting passenger : ${rideRequest.userID}`)
    await deleteRideRequest(user.company.id, rideRequest.id)
    let workTripToUpdate = workTrip
    workTripToUpdate.scheduledDrive.stops.push(
      new Stop({
        location: rideRequest.homeLocation,
        address: rideRequest.homeAddress,
        stopName: 'passenger',
        userID: rideRequest.userID,
      })
    )
    console.log('is this the number', workTripToUpdate)
    workTripToUpdate.scheduledDrive.takenSeats += 1
    console.log(workTripToUpdate)
    await updateWorkTrip(user.company.id, workTripToUpdate)

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: ownerPushToken,
        title: 'Request was accepted.',
        body: `Request was accepted by ${user.userName}`,
      }),
    })
  }

  const refusePassenger = async () => {
    console.log(`Refusing passenger : ${rideRequest.userID}`)
    deleteRideRequest(user.company.id, rideRequest.id)

    console.log('refusePassenger', ownerPushToken)

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        to: ownerPushToken,
        title: 'Request was refused',
        body: `Request was refused by ${user.userName}`,
      }),
    })
  }

  return (
    <View style={styles.buttons}>
      <Button onPress={acceptPassenger} large style={styles.button}>
        <Text style={styles.btntxt}>Accept</Text>
      </Button>
      <Button
        onPress={refusePassenger}
        large
        style={{...styles.button, backgroundColor: 'red'}}
      >
        <Text style={styles.btntxt}>Refuse</Text>
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

export default PassengerAcceptRefuseButton
