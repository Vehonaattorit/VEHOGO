import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Dimensions} from 'react-native'
import {Content, Body, Container, Text, View, Button} from 'native-base'
import MapView from 'react-native-maps'
import {updateWorkTrip} from '../controllers/workTripController'

export const DriverAcceptRefuse = ({navigation, route}) => {
  const {singleItem} = route.params

  console.log('singleItem', singleItem)
  const [mapRef, setMapRef] = useState(null)
  const [markers, setMarkers] = useState([
    singleItem.scheduledDrive.stops.map((stop) => (
      <MapView.Marker
        key={stop.address}
        coordinate={{
          latitude: stop.latLng.latitude,
          longitude: stop.latLng.longitude,
        }}
        title="Random place"
      />
    )),
  ])

  useEffect(() => {
    setTimeout(() => {
      console.log('now timer ending')
      if (mapRef != undefined && mapRef != null) {
        console.log(
          'fit markers',
          singleItem.scheduledDrive.stops.map((stop) => stop.latLng)
        )
        mapRef.fitToCoordinates(
          singleItem.scheduledDrive.stops.map((stop) => stop.latLng)
        )
      }
    }, 3000)
  }, [mapRef])

  const acceptHandler = () => {
    console.log('Accept handler.')
    // 515bb500-84b0-424f-8017-e0060f953562
    updateWorkTrip(
      '515bb500-84b0-424f-8017-e0060f953562',
      {
        ...singleItem,
        currentLocation: 'OLEN dasdas',
        pendingRequests: singleItem.pendingRideRequests.push({
          userID: 'fashfiash',
          isAccepted: false,
          waitingForAcceptance: true,
        }),
      }

      // pendingRideRequests: [
      //   singleItem.pendingRideRequests,
      //   {
      //     userID: 'fashfiash',
      //     isAccepted: false,
      //     waitingForAcceptance: true,
      //   },
      // ],
      // pendingRideRequests: [{testData: 'testData'}]
    )
  }

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
            latitude: singleItem.scheduledDrive.stops[0].latLng.latitude,
            longitude: singleItem.scheduledDrive.stops[0].latLng.longitude,
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
            <Text>{singleItem.car.driverName}</Text>
            <Text>2km</Text>
          </View>

          <Text style={{margin: 10}}>Adress</Text>

          <View style={styles.buttons}>
            <Button onPress={acceptHandler} large style={styles.button}>
              <Text style={styles.btntxt}>Accept</Text>
            </Button>
            <Button large style={{...styles.button, backgroundColor: 'red'}}>
              <Text style={styles.btntxt}>Refuse</Text>
            </Button>
          </View>
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
