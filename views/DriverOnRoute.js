import React, {useState, useEffect, useContext, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native'
import {Content, Body, Container, Icon, Button} from 'native-base'
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
import Carousel, {ParallaxImage} from 'react-native-snap-carousel'
import {ChatRoom} from '../models/chatRoom'
import {addChat, getChatRoomByIds} from '../controllers/chatRoomController'
import {AntDesign, Ionicons} from '@expo/vector-icons'
import {color} from '../constants/colors'

const {width: screenWidth} = Dimensions.get('window')

export const DriverOnRoute = ({navigation, route}) => {
  const {workTrip} = route.params

  const passengerStops = workTrip.scheduledDrive.stops.slice(1, -1)

  const {user} = useContext(UserContext)

  let intervalTimer
  const [mapRef, setMapRef] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])

  const [markers, setMarkers] = useState([
    workTrip.scheduledDrive.stops.map((stop) => (
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
  ])

  const updateLocationInterval = async () => {
    // if user is driver, update location
    if (user.travelPreference == 'driver') {
      // car position updated every 60 seconds
      intervalTimer = setInterval(callUpdateUserPosition, 60000)
      async function callUpdateUserPosition() {
        let location = await updateUserPosition(user, workTrip.id)
      }
    }
  }

  useEffect(() => {
    var tempRouteCoordinates = []
    //
    if (workTrip.route != undefined) {
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
    //
    //
    updateLocationInterval()

    return () => {
      clearInterval(intervalTimer)
    }
  }, [])

  const DriverMarker = ({workTrip}) => {
    //
    if (workTrip != undefined) {
      let reference = workTripStream(user.company.id, workTrip.id)
      const [doc] = useDocumentData(reference)
      // doc &&

      return (
        <>
          {doc != undefined && doc.driverCurrentLocation != undefined ? (
            <MapView.Marker
              image={require('../images/car-marker.png')}
              key={'driver-car'}
              coordinate={{
                latitude: doc.driverCurrentLocation.location.latitude,
                longitude: doc.driverCurrentLocation.location.longitude,
              }}
              title="car"
            />
          ) : (
            <View />
          )}
        </>
      )
    } else return <View />
  }

  const createChatRoom = async (item) => {
    const userID = user.travelPreference === 'passenger' ? item.id : item.userID
    const chatRoomName =
      user.travelPreference === 'passenger'
        ? workTrip.driverName
        : item.stopName

    const chatRooms = await getChatRoomByIds([
      {
        field: 'passengerID',
        condition: '==',
        value: userID,
      },
      {
        field: 'driverID',
        condition: '==',
        value: workTrip.driverID,
      },
    ])

    // Chatrooms array is empty
    let chatRoomID
    if (typeof chatRooms !== 'undefined' && chatRooms.length === 0) {
      chatRoomID = await addChat(
        new ChatRoom({
          driverID: workTrip.driverID,
          passengerID: userID,
          // passengerID: workTrip.scheduledDrive.stops[1].userID,
        })
      )
    } else {
      chatRoomID = chatRooms[0].id
    }

    navigation.navigate('ChatRoom', {
      chatRoomID,
      chatRoomTitle: chatRoomName,
    })
  }

  // Render Passenger List at top of the screen
  const renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={styles.listItemContainer}>
        <TouchableOpacity
          onPress={() => createChatRoom(item)}
          style={{flex: 1}}
        >
          <View style={styles.listItemTopRow}>
            <View>
              <Text style={styles.nameTopRow}>{item.stopName}</Text>
            </View>
            <View>
              <Text style={styles.distanceTopRow}>2 km</Text>
            </View>
          </View>
          <View style={styles.listItemBottomRow}>
            <View>
              <Text style={styles.latestMessageBottomRow}>
                <Ionicons
                  name="checkmark-done"
                  size={24}
                  color={color.lightBlack}
                />
                Olen etuovella
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    // Passenger
    <View style={styles.container}>
      {user.travelPreference === 'passenger' ? (
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={styles.leftArrowContainer}>
            <AntDesign name="caretleft" size={24} color={color.lightBlack} />
          </View>
          <TouchableOpacity
            onPress={() => createChatRoom(user)}
            style={styles.listItemContainer}
          >
            <View style={styles.listItemTopRow}>
              <View>
                <Text style={styles.nameTopRow}>{workTrip.driverName}</Text>
              </View>
              <View>
                <Text style={styles.distanceTopRow}>2 km</Text>
              </View>
            </View>
            <View style={styles.listItemBottomRow}>
              <View>
                <Text style={styles.latestMessageBottomRow}>
                  <Ionicons
                    name="checkmark-done"
                    size={24}
                    color={color.lightBlack}
                  />
                  Olen etuovella
                </Text>
              </View>
              <View>
                <Text style={styles.clockTimeContainer}>12:53</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.leftArrowContainer}>
            <AntDesign name="caretright" size={24} color={color.lightBlack} />
          </View>
        </View>
      ) : (
        // Driver
        <Carousel
          sliderWidth={screenWidth}
          sliderHeight={screenWidth}
          itemWidth={screenWidth - 30}
          data={passengerStops}
          renderItem={renderItem}
          hasParallaxImages={true}
        />
      )}

      <View style={styles.requestMapContent}>
        <Container style={styles.requestMapContent}>
          <MapView
            ref={(ref) => {
              setMapRef(ref)
            }}
            style={styles.mapStyle}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={{
              latitude: workTrip.scheduledDrive.stops[0].location.latitude,
              longitude: workTrip.scheduledDrive.stops[0].location.longitude,
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  // 12.04.2020 New FlatListItem for Passengers & Drivder
  listItemContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },

  leftArrowContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  },
  listItemTopRow: {
    padding: 10,
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  nameTopRow: {
    fontSize: 20,
    color: color.lightBlack,
    fontFamily: 'open-sans-regular',
  },
  latestMessageBottomRow: {
    fontSize: 16,
    color: color.lightBlack,
    fontFamily: 'open-sans-regular',
  },
  clockTimeContainer: {
    fontSize: 16,
    color: color.lightBlack,
    fontFamily: 'open-sans-regular',
  },
  listItemBottomRow: {
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  distanceTopRow: {
    fontSize: 16,
    color: color.lightBlack,
    fontFamily: 'open-sans-regular',
  },
})
