import React, {useState, useEffect, useContext} from 'react'
import {StyleSheet, Dimensions, Image} from 'react-native'
import {Content, Body, Container, Text, View, Icon, Button} from 'native-base'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import decodePolyline from 'decode-google-map-polyline'
import * as Location from 'expo-location'
import {updateWorkTrip, workTripStream} from '../controllers/workTripController'
import {WorkTrip} from '../models/workTrip'
import firebase from 'firebase/app'
import {UserContext} from '../contexts'
import {updateUserPosition} from '../utils/driverFunctions'
import {useDocumentData} from 'react-firebase-hooks/firestore'

export const DriverOnRoute = ({navigation, route}) => {
  const {workTrip} = route.params
  const {user} = useContext(UserContext)

  let intervalTimer
  const [mapRef, setMapRef] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])

  const [markers, setMarkers] = useState([
    workTrip.scheduledDrive.stops.map((stop) => (
      <MapView.Marker
        image={stop.stopName == 'Home' || stop.stopName == user.company.name ? stop.stopName == 'Home' ? require('../images/home-map-icon-white.png') : require('../images/work-map-icon-white.png') : require('../images/passenger-map-icon-white.png')}
        key={stop.address}
        coordinate={{
          latitude: stop.location.latitude,
          longitude: stop.location.longitude,
        }}
        title={stop.address}
      />
    )),
  ])

  const updateLocationInterval = async () => {
    // if user is driver, update location
    if (user.travelPreference == 'driver') {
      // car position updated every 60 seconds
      intervalTimer = setInterval(callUpdateUserPosition, 60000);
      async function callUpdateUserPosition() {
        let location = await updateUserPosition(user, workTrip.id)
      }
    }
  }

  useEffect(() => {
    var tempRouteCoordinates = []
    console.log('inside useEffect before route', workTrip)
    if (workTrip.route != undefined) {
      console.log('inside that if')
      workTrip.route.routes[0].legs.map((leg) => {
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
    updateLocationInterval()

    return () => {
      clearInterval(intervalTimer)
    }
  }, [])

  const DriverMarker = ({workTrip}) => {
    console.log('listening to stream', workTrip.id)
    if (workTrip != undefined) {
      let reference = workTripStream(user.company.id, workTrip.id)
      const [doc] = useDocumentData(reference)
      doc && console.log('workTrip stream', doc)

      return (
        <>
          {doc && <MapView.Marker
            image={require('../images/car-marker.png')}
            key={'driver-car'}
            coordinate={{
              latitude: doc.driverCurrentLocation.location.latitude,
              longitude: doc.driverCurrentLocation.location.longitude,
            }}
            title="car"
          />}
        </>)
    }
    else return <View />
  }

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
                workTrip.scheduledDrive.stops[0].location.latitude,
              longitude:
                workTrip.scheduledDrive.stops[0].location
                  .longitude,
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
            <DriverMarker workTrip={workTrip} />
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
