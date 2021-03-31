import React, {useEffect} from 'react'
import {StyleSheet} from 'react-native'
import {Text, View, Button} from 'native-base'
import {updateRideRequest} from '../controllers/rideRequestController'
import {RideRequest} from '../models/rideRequest'

const PassengerRideRequestButton = ({user, workTrip}) => {
  const myUser = user
  const myWorkTrip = workTrip

  useEffect(() => {
    console.log('workTrip', myWorkTrip)
    console.log('user', myUser)
  })

  const requestRide = async () => {
    console.log(
      `Requesting ride from company: ${user.company[0].id} worktrip ${myWorkTrip.id} with user ${user.userName}`
    )
    console.log('starting update')
    await updateRideRequest(
      user.company[0].id,
      new RideRequest({
        homeLocation: user.homeLocation,
        homeAddress: user.homeAddress,
        userID: user.id,
        city: user.city,
        userName: user.userName,
        workTripRefID: myWorkTrip.id,
        driverID: myWorkTrip.driverID,
        workDayNum: myWorkTrip.workDayNum,
      })
    )
    console.log('finished update')
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
