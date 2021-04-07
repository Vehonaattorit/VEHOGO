import React, {useState, useEffect, useRef, useContext} from 'react'
import {UserContext} from '../contexts'
import {StyleSheet, Dimensions} from 'react-native'
import {Content, Body, Container, Text, View, Button} from 'native-base'
import MapView from 'react-native-maps'
import {updateWorkTrip} from '../controllers/workTripController'
import PassengerRideRequestButton from './passengerRideRequestButton'
import PassengerAcceptRefuseButton from './passengerAcceptRefuseButton'

export const DriverAcceptRefuse = ({navigation, route}) => {
  const {singleItem, rideRequest} = route.params
  const {user} = useContext(UserContext)

  const [mapRef, setMapRef] = useState(null)
  const [markers, setMarkers] = useState([
    singleItem.scheduledDrive.stops.map((stop) => (
      <MapView.Marker
        key={stop.address}
        coordinate={{
          latitude: stop.location.latitude,
          longitude: stop.location.longitude,
        }}
        title="Random place"
      />
    )),
    rideRequest != undefined && (
      <MapView.Marker
        key={rideRequest.address}
        coordinate={{
          latitude: rideRequest.homeLocation.latitude,
          longitude: rideRequest.homeLocation.longitude,
        }}
      />
    ),
  ])

  useEffect(() => {
    setTimeout(() => {
      console.log('now timer ending')
      if (mapRef != undefined && mapRef != null) {
        console.log(
          'fit markers',
          singleItem.scheduledDrive.stops.map((stop) => stop.address)
        )
        mapRef.fitToSuppliedMarkers(
          singleItem.scheduledDrive.stops.map((stop) => stop.address)
        )
      }
    }, 3000)
  }, [mapRef])

  return (
    <View style={styles.view}>
      <Container style={styles.requestMapContent}>
        <MapView
          ref={(ref) => {
            setMapRef(ref)
          }}
          style={styles.mapStyle}
          provider={MapView.PROVIDER_GOOGLE}
          initialRegion={{
            latitude: singleItem.scheduledDrive.stops[0].location.latitude,
            longitude: singleItem.scheduledDrive.stops[0].location.longitude,
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}
        >
          {markers}
        </MapView>
      </Container>

      <Container style={styles.requestAcceptRefuseContent}>
        <Content padder>
          <View style={styles.info}>
            <Text>
              {rideRequest == undefined
                ? singleItem.car.driverName
                : rideRequest.userName}
            </Text>
            <Text>2km</Text>
          </View>

          <Text style={{margin: 10}}>
            Address{rideRequest == undefined ? '' : rideRequest.homeAddress}
          </Text>
          {user.travelPreference == 'passenger' ? (
            <PassengerRideRequestButton
              navigation={navigation}
              user={user}
              workTrip={singleItem}
            />
          ) : (
            <PassengerAcceptRefuseButton
              // navigation={navigation}
              user={user}
              workTrip={singleItem}
              rideRequest={rideRequest}
            />
          )}
        </Content>
      </Container>
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
