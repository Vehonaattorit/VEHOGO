import React, {useState, useEffect, useContext, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import {Container} from 'native-base'
import MapView from 'react-native-maps'
import decodePolyline from 'decode-google-map-polyline'
import {updateWorkTrip, workTripStream} from '../controllers/workTripController'
import {UserContext} from '../contexts'
import {updateUserPosition} from '../utils/driverFunctions'
import {useDocumentData} from 'react-firebase-hooks/firestore'
import Carousel, {ParallaxImage} from 'react-native-snap-carousel'
import {ChatRoom} from '../models/chatRoom'
import {addChat, getChatRoomByIds} from '../controllers/chatRoomController'
import {AntDesign, Ionicons} from '@expo/vector-icons'
import {color} from '../constants/colors'
import {calculateDistance} from '../utils/utils'
import {FullWidthButton} from '../components/fullWidthButton'


const {width: screenWidth} = Dimensions.get('window')

export const DriverOnRoute = ({navigation, route}) => {
  const {workTrip} = route.params
  const scrollRef = useRef()
  const mapRef = useRef()

  const passengerStops = workTrip.scheduledDrive.stops.slice(1)

  const {user} = useContext(UserContext)

  let intervalTimer
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [showNextStopBar, setShowNextStopBar] = useState(false)
  const [showStop, setShowStop] = useState(false)

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
        identifier={stop.address}
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
      intervalTimer = setInterval(callUpdateUserPosition, 5000)
      async function callUpdateUserPosition() {

        //update driver position to firebase
        let location = await updateUserPosition(user, workTrip.id)

        //calculate distance between next stop and current position
        let distance = calculateDistance(location.coords.latitude, location.coords.longitude, workTrip.scheduledDrive.stops[workTrip.scheduledDrive.nextStop].location.latitude, workTrip.scheduledDrive.stops[workTrip.scheduledDrive.nextStop].location.longitude)
        console.log('distance', distance)

        //show NextStopBar if distance less than 300m
        if (distance <= 0.3) {

          if (workTrip.scheduledDrive.stops.length - 1 === workTrip.scheduledDrive.nextStop) {
            setShowStop(true)
          } else {
            setShowNextStopBar(true)
          }

        }
      }
    }
  }

  const changeNextStop = async () => {
    setShowNextStopBar(false)
    if (workTrip.scheduledDrive.stops.length - 1 !== workTrip.scheduledDrive.nextStop) {

      workTrip.scheduledDrive.nextStop += 1
      await updateWorkTrip(user.company.id, workTrip)
      //check if stop is laststop
      if (workTrip.scheduledDrive.stops.length - 1 === workTrip.scheduledDrive.nextStop) {
        workTrip.isDriving = false
        await updateWorkTrip(user.company.id, workTrip)
        console.log('Arrived to location')
      } else {
        scrollRef.current.snapToItem(workTrip.scheduledDrive.nextStop - 1)
      }
    }

  }

  const stopDriving = async () => {
    workTrip.isDriving = false
    await updateWorkTrip(user.company.id, workTrip)
    navigation.popToTop()
  }
  // useEffect(() => {

  // }, [mapRef])

  useEffect(() => {
    setTimeout(() => {
      if (mapRef != undefined) {
        mapRef.current.fitToSuppliedMarkers(workTrip.scheduledDrive.stops.map((stop) => stop.address), { edgePadding: { top: 0, right: 150, bottom: 500, left: 150 },animated: true })
      }
    }, 500)


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
    updateLocationInterval()
    return () => {
      clearInterval(intervalTimer)
    }
  }, [])

  const DriverMarker = ({workTrip}) => {

    if (workTrip != undefined) {
      let reference = workTripStream(user.company.id, workTrip.id)
      const [doc] = useDocumentData(reference)
      // doc &&
      if (doc != undefined && doc.driverCurrentLocation != undefined) {
        console.log('user location', doc.driverCurrentLocation.location)
      }
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
    let chatRoom
    if (typeof chatRooms !== 'undefined' && chatRooms.length === 0) {
      chatRoom = await addChat(
        new ChatRoom({
          driverID: workTrip.driverID,
          passengerID: userID,
        })
      )
    } else {
      chatRoom = chatRooms[0]
    }

    navigation.navigate('ChatRoom', {
      chatRoom,
      chatRoomTitle: chatRoomName,
    })
  }

  // Render Passenger List at top of the screen
  const renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={styles.leftArrowContainer}>
          <AntDesign name="caretleft" size={24} color={color.lightBlack} />
        </View>
        <TouchableOpacity
          onPress={() => createChatRoom(item)}
          style={styles.listItemContainer}
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
            <View>
              <Text style={styles.clockTimeContainer}>12:53</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.leftArrowContainer}>
          <AntDesign name="caretright" size={24} color={color.lightBlack} />
        </View>
      </View>
      // <View style={styles.listItemContainer}>
      //   <TouchableOpacity
      //     onPress={() => createChatRoom(item)}
      //     style={{flex: 1}}
      //   >
      //     <View style={styles.listItemTopRow}>
      //       <View>
      //         <Text style={styles.nameTopRow}>{item.stopName}</Text>
      //       </View>
      //       <View>
      //         <Text style={styles.distanceTopRow}>2 km</Text>
      //       </View>
      //     </View>
      //     <View style={styles.listItemBottomRow}>
      //       <View>
      //         <Text style={styles.latestMessageBottomRow}>
      //           <Ionicons
      //             name="checkmark-done"
      //             size={24}
      //             color={color.lightBlack}
      //           />
      //           Olen etuovella
      //         </Text>
      //       </View>
      //     </View>
      //   </TouchableOpacity>
      // </View>
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
          firstItem={workTrip.scheduledDrive.nextStop - 1}
          sliderWidth={screenWidth}
          sliderHeight={screenWidth}
          itemWidth={screenWidth - 30}
          data={passengerStops}
          renderItem={renderItem}
          hasParallaxImages={true}
          ref={scrollRef}

        //onSnapToItem={workTrip.scheduledDrive.nextStop}
        />
      )}

      <View style={styles.requestMapContent}>
        <Container style={styles.requestMapContent}>
          <MapView
            ref={mapRef}
            style={styles.mapStyle}
            provider={MapView.PROVIDER_GOOGLE}
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
        {showNextStopBar &&
          <FullWidthButton
            title={'Next Stop'}
            direction={'row'}
            children={<Text>Picked up passenger?</Text>}
            onPress={() => {changeNextStop()}}
          >

          </FullWidthButton>
        }
        {showStop &&
          <FullWidthButton
            title={'Stop Driving'}
            direction={'row'}
            color={color.radicalRed}
            children={<Text>Destination reached</Text>}
            onPress={() => {stopDriving()}}
          >

          </FullWidthButton>
        }
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
  nextButtonBottomRow: {
    alignSelf: 'center',
    fontSize: 16,
    color: color.lightBlack,
    fontFamily: 'open-sans-regular',
  },
})
