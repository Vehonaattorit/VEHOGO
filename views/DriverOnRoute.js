import React, {useState, useEffect} from 'react'
import {StyleSheet, Dimensions} from 'react-native'
import {Content, Body, Container, Text, View, Icon, Button} from 'native-base'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import decodePolyline from 'decode-google-map-polyline'

export const DriverOnRoute = ({navigation, route}) => {
  const {workTrip} = route.params
  console.log('this worktrip', workTrip)
  const origin = {latitude: 60.169929425303415, longitude: 24.938383101854694}
  const destination = {latitude: 60.203218047839, longitude: 24.65566529896304}
  const apikey = 'Your api key here'


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
    ))
  ])

  useEffect(() => {
    var tempRouteCoordinates = []
    console.log('workTripRoute inside use effect', workTrip.route)
    if (workTrip.route != undefined) {
      console.log('inside that if')
      workTrip.route.route.routes[0].legs.map((leg) => {
        leg.steps.map((step) => {
          var decodedPolyLines = decodePolyline(step.polyline.points)
          decodedPolyLines.forEach(polylineCoords => {
            tempRouteCoordinates.push({latitude: polylineCoords.lat, longitude: polylineCoords.lng})
          })
        })
      })
    }
    setRouteCoordinates(tempRouteCoordinates)
    console.log('markers', markers)
    console.log('decoded polyline',)
    setTimeout(() => {
      console.log('now timer ending')
      if (mapRef != undefined && mapRef != null) {
        console.log(
          'fit markers',
          workTrip.startingRide.scheduledDrive.stops.map((stop) => stop.address)
        )
        mapRef.fitToSuppliedMarkers(
          workTrip.startingRide.scheduledDrive.stops.map((stop) => stop.address)
        )
      }
    }, 3000)
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
              latitude: workTrip.startingRide.scheduledDrive.stops[0].location.latitude,
              longitude: workTrip.startingRide.scheduledDrive.stops[0].location.longitude,
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

