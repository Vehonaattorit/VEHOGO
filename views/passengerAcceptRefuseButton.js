import React, {useEffect} from 'react'
import {StyleSheet} from 'react-native'
import {Text, View, Button} from 'native-base'
import {deleteRideRequest} from '../controllers/rideRequestController'
import {RideRequest} from '../models/rideRequest'
import {Stop} from '../models/stop'
import {updateWorkTrip} from '../controllers/workTripController'

const PassengerAcceptRefuseButton = (props) => {
  const {user, workTrip, rideRequest} = props

  useEffect(() => {})

  const acceptPassenger = async () => {
    console.log(`Accepting passenger : ${rideRequest.userID}`)
    deleteRideRequest(user.company[0].id, rideRequest.id)
    let workTripToUpdate = workTrip.scheduledDrive.stops.push(
      new Stop({
        location: rideRequest.homeLocation,
        address: rideRequest.homeAddress,
        stopName: 'passenger',
        userID: rideRequest.userID,
      })
    )
    updateWorkTrip(user.company[0].id, workTripToUpdate)
  }

  const refusePassenger = async () => {
    console.log(`Refusing passenger : ${rideRequest.userID}`)
    deleteRideRequest(user.company[0].id, rideRequest.id)
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
