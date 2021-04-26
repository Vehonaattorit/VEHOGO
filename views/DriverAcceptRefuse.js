import React, {useState, useEffect, useRef, useContext} from 'react'
import {UserContext} from '../contexts'
import {StyleSheet, Dimensions, Image} from 'react-native'
import {Content, Container, Text, View} from 'native-base'
import MapView, {Marker} from 'react-native-maps'
import PassengerRideRequestButton from './passengerRideRequestButton'
import PassengerAcceptRefuseButton from './passengerAcceptRefuseButton'
import decodePolyline from 'decode-google-map-polyline'
import {checkWhatDayItIs, drivingTime} from '../utils/utils'
import {getWorkTrip} from '../controllers/workTripController'
import moment from 'moment'

export const DriverAcceptRefuse = ({navigation, route}) => {
  const {
    singleItem,
    isPassengerIncluded,
    arrivalTime,
    rideRequest,
  } = route.params
  const {user} = useContext(UserContext)

  const [mapRef, setMapRef] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [markers, setMarkers] = useState([
    singleItem.scheduledDrive.stops.map((stop) => (
      <Marker
        key={stop.address}
        coordinate={{
          latitude: stop.location.latitude,
          longitude: stop.location.longitude,
        }}
        title={stop.address}
      >
        <Image
          source={
            stop.stopName == 'Home' || stop.stopName == user.company.name
              ? stop.stopName == 'Home'
                ? require('../images/home-map-icon-white.png')
                : require('../images/work-map-icon-white.png')
              : require('../images/passenger-map-icon-white.png')
          }
          style={{height: 45, width: 45}}
        ></Image>
      </Marker>
    )),
    rideRequest != undefined && (
      <Marker
        key={rideRequest.id}
        coordinate={{
          latitude: rideRequest.homeLocation.latitude,
          longitude: rideRequest.homeLocation.longitude,
        }}
      >
        <Image
          source={require('../images/passenger-map-icon-green.png')}
          style={{height: 45, width: 45}}
        ></Image>
      </Marker>
    ),
  ])

  const [workTrip, setWorkTrip] = useState(null)

  const getWorkTripData = async (workTripRefID) => {
    const data = await getWorkTrip(user.company.id, workTripRefID)
    console.log('data', data)

    setWorkTrip(workTrip)
  }

  const {stops} = singleItem.scheduledDrive

  useEffect(() => {
    var tempRouteCoordinates = []

    if (singleItem.route != undefined) {
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

    navigation.setOptions({
      title: rideRequest === undefined ? 'Request Ride' : rideRequest.userName,
    })
  }, [])

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
            strokeColor="#26AAE2"
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

          <View style={styles.info}>
            <Text style={styles.text}>
              {'Home: ' +
                (rideRequest == undefined
                  ? singleItem.goingTo === 'home'
                    ? stops[stops.length - 1].address
                    : stops[0].address
                  : rideRequest.homeAddress)}
            </Text>
            <Text style={styles.text}>{drivingTime(singleItem)} min</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.text}>
              {rideRequest == undefined
                ? checkWhatDayItIs(singleItem.workDayNum)
                : checkWhatDayItIs(rideRequest.workDayNum)}
            </Text>
            <Text style={styles.text}>
              {singleItem.goingTo === 'home' ? 'Going ' : 'Going to'}
              {rideRequest == undefined
                ? singleItem.goingTo.charAt(0).toUpperCase() +
                  singleItem.goingTo.slice(1)
                : singleItem.goingTo.charAt(0).toUpperCase() +
                  singleItem.goingTo.slice(1)}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.text}>
              {rideRequest == undefined
                ? singleItem.goingTo === 'home'
                  ? 'Leaves work at: ' +
                    moment(singleItem.scheduledDrive.start.toDate()).format(
                      'HH:mm'
                    )
                  : 'Leaves home at: ' +
                    moment(singleItem.scheduledDrive.start.toDate()).format(
                      'HH:mm'
                    )
                : 'Work times: ' +
                  moment(rideRequest.start.toDate()).format('HH:mm') +
                  ' - ' +
                  moment(rideRequest.end.toDate()).format('HH:mm')}
            </Text>
          </View>

          {user.travelPreference == 'passenger' ? (
            <PassengerRideRequestButton
              navigation={navigation}
              user={user}
              isPassengerIncluded={isPassengerIncluded}
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
