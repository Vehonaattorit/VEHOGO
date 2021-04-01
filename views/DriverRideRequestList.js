import React, {useState, useEffect, useRef, useContext} from 'react'
import {UserContext} from '../contexts'
import {FlatList} from 'react-native'
import {Text, View, Button} from 'native-base'
import PassengerListItem from './PassengerListItem'
import {StyleSheet, Dimensions} from 'react-native'
import {rideRequestQuery} from '../controllers/rideRequestController'
import {getWorkTrip} from '../controllers/workTripController'

export const DriverRideRequestList = ({navigation, dataArray}) => {
  const {user} = useContext(UserContext)
  const [rideRequests, setRideRequests] = useState([])

  const getRideRequests = async () => {
    let requests = await rideRequestQuery(
      user.company[0].id,
      'driverID',
      '==',
      user.id
    )
    console.log(requests)
    setRideRequests(requests)
  }
  useEffect(() => {
    getRideRequests()
  }, [])

  const viewRequest = async (rideRequest) => {
    console.log(user.company[0].id,rideRequest.workTripRefID)
    let singleItem = await getWorkTrip(
      user.company[0].id,
      rideRequest.workTripRefID
    )
    console.log('driverRideRequest single item',singleItem)
    if(singleItem == undefined) return
    navigation.navigate('RequestRide', {
      singleItem: singleItem,
      rideRequest: rideRequest,
    })
  }
  return (
    <View>
      {rideRequests.map((rideRequest) => {
        return (
          <View key={rideRequest.id}>
            <Text>{rideRequest.userName}</Text>
            <Button
              onPress={() => {
                viewRequest(rideRequest)
              }}
              large
              style={styles.button}
            >
              <Text style={styles.btntxt}>Request</Text>
            </Button>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#26aae2',
  },
  requestMapContent: {
    flex: 2.0,
    backgroundColor: 'black',
  },
  requestAcceptRefuseContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#26aae2',
    borderRadius: 15,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  btntxt: {
    color: 'white',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})
