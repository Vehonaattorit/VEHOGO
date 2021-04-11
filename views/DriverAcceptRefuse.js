import React, {useState, useEffect, useRef, useContext} from 'react'
import {UserContext} from '../contexts'
import {StyleSheet, Dimensions} from 'react-native'
import {Content, Container, Text, View} from 'native-base'
import MapView from 'react-native-maps'
import PassengerRideRequestButton from './passengerRideRequestButton'
import PassengerAcceptRefuseButton from './passengerAcceptRefuseButton'
import decodePolyline from 'decode-google-map-polyline'

export const DriverAcceptRefuse = ({navigation, route}) => {
  const {singleItem, rideRequest} = route.params
  const {user} = useContext(UserContext)

  const [mapRef, setMapRef] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [markers, setMarkers] = useState([
    singleItem.scheduledDrive.stops.map((stop) => (
      <MapView.Marker
        image={
          stop.stopName == 'Home' || stop.stopName == user.company.name
            ? stop.stopName == 'Home'
              ? require('../images/home-map-icon-white.png')
              : require('../images/work-map-icon-white.png')
            : require('../images/passenger-map-icon-white.png')
        }
        key={stop.address}
        coordinate={{
          latitude: stop.location.latitude,
          longitude: stop.location.longitude,
        }}
        title={stop.address}
      />
    )),
    rideRequest != undefined && (
      <MapView.Marker
        image={require('../images/passenger-map-icon-green.png')}
        key={rideRequest.address}
        coordinate={{
          latitude: rideRequest.homeLocation.latitude,
          longitude: rideRequest.homeLocation.longitude,
        }}
      />
    ),
  ])
  //console.log('requested route',singleItem)

  useEffect(() => {
    var tempRouteCoordinates = []
    console.log('inside useEffect before route', singleItem.route)
    if (singleItem.route != undefined) {
      console.log('inside that if')
      singleItem.route.routes[0].legs.map((leg) => {
        leg.steps.map((step) => {
          var decodedPolyLines = decodePolyline(step.polyline.points)
          decodedPolyLines.forEach((polylineCoords) => {
            tempRouteCoordinates.push({
              latitude: polylineCoords.lat,
              longitude: polylineCoords.lng,
            })
          })
        })
      })
    }
    setRouteCoordinates(tempRouteCoordinates)
  }, [])

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('now timer ending')
  //     if (mapRef != undefined && mapRef != null) {
  //       console.log(
  //         'fit markers',
  //         singleItem.scheduledDrive.stops.map((stop) => stop.address)
  //       )
  //       mapRef.fitToSuppliedMarkers(
  //         singleItem.scheduledDrive.stops.map((stop) => stop.address)
  //       )
  //     }
  //   }, 3000)
  // }, [mapRef])

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
          <MapView.Polyline
            coordinates={routeCoordinates}
            strokeColor="#000"
            strokeWidth={4}
          />
          {markers}
        </MapView>
      </Container>

      <Container style={styles.requestAcceptRefuseContent}>
        <Content padder>
          <View style={styles.info}>
            <Text style={styles.text}>
              {rideRequest == undefined
                ? singleItem.driverName
                : rideRequest.userName}
            </Text>
            <Text style={styles.text}>2 km</Text>
          </View>

          <Text style={{...styles.text, margin: 10}}>
            {rideRequest == undefined ? '' : rideRequest.homeAddress}
          </Text>
          {user.travelPreference == 'passenger' ? (
            <PassengerRideRequestButton
              navigation={navigation}
              user={user}
              workTrip={singleItem}
            />
          ) : (
            <PassengerAcceptRefuseButton
              user={user}
              workTrip={singleItem}
              rideRequest={rideRequest}
              navigation={navigation}
            />
          )}
        </Content>
      </Container>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'open-sans-semi-bold',
  },
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
