import React, {useState, useEffect, useContext} from 'react'
import {StyleSheet, Dimensions} from 'react-native'
import {Content, Body, Container, Text, View, Icon, Button} from 'native-base'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import decodePolyline from 'decode-google-map-polyline'
import * as Location from 'expo-location'
import {updateWorkTrip} from '../controllers/workTripController'
import {WorkTrip} from '../models/workTrip'
import firebase from 'firebase/app'
import {UserContext} from '../contexts'

export const DriverOnRoute = ({navigation, route}) => {
  const {workTrip} = route.params
  const {activeRide} = route.params
  const {user} = useContext(UserContext)

  let intervalTimer
  const [mapRef, setMapRef] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [markers, setMarkers] = useState([
    workTrip.startingRide.scheduledDrive.stops.map((stop) => (
      <MapView.Marker
        key={stop.address}
        coordinate={{
          latitude: stop.location.latitude,
          longitude: stop.location.longitude,
        }}
        title="Random place"
      />
    )),
  ])

  const updateLocation = async () => {
    // set interval
    intervalTimer = setInterval(mycode, 120000);
    async function mycode() {

      //get current position of user
      let location = await Location.getCurrentPositionAsync({})

      //modify location to be GeoPoint
      const locationPoint = new firebase.firestore.GeoPoint(
        location.coords.latitude,
        location.coords.longitude,
      )
      const time = new Date()

      const workTripToUpdate = new WorkTrip({
        id: workTrip.startingRide.id, driverCurrentLocation: {
          location: locationPoint,
          speed: location.coords.speed,
          time: new firebase.firestore.Timestamp.fromDate(time)
      }
      })
      await updateWorkTrip(user.company.id,workTripToUpdate)
      console.log('location updated')
    }
  }

  useEffect(() => {
    var tempRouteCoordinates = []
    console.log('inside useEffect before route', workTrip.startingRide)
    if (workTrip.startingRide.route != undefined) {
      console.log('inside that if')
      workTrip.startingRide.route.routes[0].legs.map((leg) => {
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
    console.log('markers', markers)
    console.log('decoded polyline')
    updateLocation()

    return () => {
      clearInterval(intervalTimer)
    }
  }, [])



  return (
    <View style={styles.view}>
      <Container style={styles.requestAcceptRefuseContent}>
        <Content padder>
          <View style={styles.info}>
            <Text>Michael Lock</Text>
            <Text>2km</Text>
          </View>

          <View style={styles.info}>
            <Text>Olen etuovella</Text>
            <Button small onPress={() => navigation.navigate('Chat')}>
              <Icon active name="chatbox-ellipses-outline" />
            </Button>
          </View>
        </Content>
      </Container>

      <View style={styles.requestMapContent}>
        <Container style={styles.requestMapContent}>
          <MapView
            ref={(ref) => {
              setMapRef(ref)
            }}
            style={styles.mapStyle}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={{
              latitude:
                workTrip.startingRide.scheduledDrive.stops[0].location.latitude,
              longitude:
                workTrip.startingRide.scheduledDrive.stops[0].location
                  .longitude,
              latitudeDelta: 1,
              longitudeDelta: 1,
            }}
          >
            <MapView.Polyline
              coordinates={routeCoordinates}
              strokeColor="#000"
              strokeWidth={6}
            />
            {markers}
          </MapView>
        </Container>
      </View>
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
    flex: 5,
    backgroundColor: 'black',
  },
  requestAcceptRefuseContent: {
    flex: 1,
    backgroundColor: 'white',
  },

  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})
