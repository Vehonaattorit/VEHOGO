import React, {useState, useEffect, useContext, useRef} from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import {Container} from 'native-base'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import decodePolyline from 'decode-google-map-polyline'
import {
  updateWorkTrip,
  //useIsDrivingHook,
  workTripStream,
} from '../controllers/workTripController'
import {UserContext} from '../contexts'
import {updateUserPosition} from '../utils/driverFunctions'
import {useDocumentData} from 'react-firebase-hooks/firestore'
import Carousel, {ParallaxImage} from 'react-native-snap-carousel'
import {ChatRoom} from '../models/chatRoom'
import {
  deleteChatRoom,
  queryChatRoom,
  useChatRoomHooks,
} from '../controllers/chatRoomController'
import {AntDesign, Ionicons} from '@expo/vector-icons'
import {color} from '../constants/colors'
import {calculateDistance} from '../utils/utils'
import {FullWidthButton} from '../components/fullWidthButton'

const {width: screenWidth} = Dimensions.get('window')

import 'firebase/auth'
import {getUser} from '../controllers/userController'
import QuickMessagesMenu from '../components/QuickMessagesMenu'

// Firebase

import firebase from 'firebase/app'
import 'firebase/firestore'
import {deleteMessages, getMessages} from '../controllers/chatMessageController'

const db = firebase.firestore()

export const DriverOnRoute = ({navigation, route}) => {
  const {workTrip} = route.params
  const scrollRef = useRef()
  const mapRef = useRef()

  const passengerStops = workTrip.scheduledDrive.stops.slice(1)

  const {user} = useContext(UserContext)
  const {chatRooms, isLoading} = useChatRoomHooks()
  //const {isDriving} = useIsDrivingHook(user, workTrip)

  let intervalTimer
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [showNextStopBar, setShowNextStopBar] = useState(false)
  const [showStop, setShowStop] = useState(false)
  // const [chatRooms, setChatRooms] = useState([])

  const [latestMessage, setLatestMessage] = useState('')
  //

  const [markers, setMarkers] = useState([
    workTrip.scheduledDrive.stops.map((stop) => (
      <Marker
        key={stop.address}
        identifier={stop.address}
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
                ? passengerStops[workTrip.scheduledDrive.nextStop - 1]
                    .stopName == stop.stopName
                  ? require('../images/home-map-icon-blue.png')
                  : require('../images/home-map-icon-white.png')
                : passengerStops[workTrip.scheduledDrive.nextStop - 1]
                    .stopName == stop.stopName
                ? require('../images/work-map-icon-blue.png')
                : require('../images/work-map-icon-white.png')
              : workTrip.scheduledDrive.stops[workTrip.scheduledDrive.nextStop]
                  .stopName == stop.stopName
              ? require('../images/passenger-map-icon-blue.png')
              : require('../images/passenger-map-icon-white.png')
          }
          style={{height: 45, width: 45}}
        ></Image>
      </Marker>
    )),
  ])

  /**/

  const changeNextStop = async () => {
    setShowNextStopBar(false)
    if (
      workTrip.scheduledDrive.stops.length !== workTrip.scheduledDrive.nextStop
    ) {
      workTrip.scheduledDrive.nextStop += 1
      await updateWorkTrip(user.company.id, workTrip)
      //check if stop is laststop
      if (
        workTrip.scheduledDrive.stops.length ===
        workTrip.scheduledDrive.nextStop
      ) {
        workTrip.isDriving = false
        await updateWorkTrip(user.company.id, workTrip)
      } else {
        scrollRef.current.snapToItem(workTrip.scheduledDrive.nextStop)
      }
    }
    showNextStop()
  }

  const showNextStop = () => {
    setMarkers(
      workTrip.scheduledDrive.stops.map((stop) => (
        <Marker
          key={stop.address}
          identifier={stop.address}
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
                  ? passengerStops[workTrip.scheduledDrive.nextStop - 1]
                      .stopName == stop.stopName
                    ? require('../images/home-map-icon-blue.png')
                    : require('../images/home-map-icon-white.png')
                  : passengerStops[workTrip.scheduledDrive.nextStop - 1]
                      .stopName == stop.stopName
                  ? require('../images/work-map-icon-blue.png')
                  : require('../images/work-map-icon-white.png')
                : workTrip.scheduledDrive.stops[
                    workTrip.scheduledDrive.nextStop
                  ].stopName == stop.stopName
                ? require('../images/passenger-map-icon-blue.png')
                : require('../images/passenger-map-icon-white.png')
            }
            style={{height: 45, width: 45}}
          ></Image>
        </Marker>
      ))
    )
  }

  const carouselChangeStop = async (index) => {
    workTrip.scheduledDrive.nextStop = index + 1

    await updateWorkTrip(user.company.id, workTrip)
    setShowNextStopBar(false)
    setShowStop(false)
    showNextStop()
  }

  const stopDriving = async () => {
    const {stops} = workTrip.scheduledDrive

    const passengerStops = stops.slice(1, stops.length - 1)

    // await deleteMessages('0c376027-a378-4ebc-ad8a-2e1absd828b96')
    for (let i = 0; i < chatRooms.length; i++) {
      for (let j = 0; j < passengerStops.length; j++) {
        if (
          chatRooms[i].driverID === user.id &&
          passengerStops[j].userID === chatRooms[i].passengerID
        ) {
          await deleteMessages(chatRooms[i].id)
        }
      }
    }

    workTrip.isDriving = false
    await updateWorkTrip(user.company.id, workTrip)

    let userIds = workTrip.scheduledDrive.stops.map((item) => item.userID)

    userIds = userIds.filter((item) => item !== user.id)

    for (const userId of userIds) {
      const notifyUser = await getUser(userId)

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: notifyUser.expoToken,
          title: `${workTrip.driverName} has ended driving.`,
          body: `Route has ended.`,
        }),
      })
    }

    navigation.popToTop()
  }
  /*useEffect(() => {

  }, [mapRef])*/

  useEffect(() => {
    const updateLocationInterval = async () => {
      // if user is driver, update location
      if (user.travelPreference == 'driver') {
        // car position updated every 10 seconds
        intervalTimer = setInterval(callUpdateUserPosition, 10000)
      }
    }

    async function callUpdateUserPosition() {
      //update driver position to firebase

      let location = await updateUserPosition(user, workTrip.id)

      //calculate distance between next stop and current position
      let distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        workTrip.scheduledDrive.stops[workTrip.scheduledDrive.nextStop].location
          .latitude,
        workTrip.scheduledDrive.stops[workTrip.scheduledDrive.nextStop].location
          .longitude
      )

      //calculate distance between location and end position
      let distanceToEnd = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        workTrip.scheduledDrive.stops[workTrip.scheduledDrive.stops.length - 1]
          .location.latitude,
        workTrip.scheduledDrive.stops[workTrip.scheduledDrive.stops.length - 1]
          .location.longitude
      )

      //always show end route if distance under 100m
      if (distanceToEnd >= 0.1) {
        //show NextStopBar if distance less than 100m
        if (distance <= 0.1) {
          //if next stop is last show StopBar
          setShowNextStopBar(true)
        }
      } else {
        setShowStop(true)
      }
    }

    if (user.travelPreference === 'driver') {
      updateLocationInterval()
    }

    setTimeout(() => {
      if (mapRef != undefined) {
        mapRef.current.fitToSuppliedMarkers(
          workTrip.scheduledDrive.stops.map((stop) => stop.address),
          {
            edgePadding: {top: 0, right: 150, bottom: 500, left: 150},
            animated: true,
          }
        )
      }
    }, 2000)
    // }, 1000)20.04.2021 initial time

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

    return () => {
      console.log('cleaning')
      clearInterval(intervalTimer)
    }
  }, [])

  const DriverMarker = ({workTrip}) => {
    if (workTrip != undefined) {
      let reference = workTripStream(user.company.id, workTrip.id)
      const [doc] = useDocumentData(reference)

      return (
        <>
          {doc != undefined && doc.driverCurrentLocation != undefined ? (
            <Marker
              key={'driver-car'}
              coordinate={{
                latitude: doc.driverCurrentLocation.location.latitude,
                longitude: doc.driverCurrentLocation.location.longitude,
              }}
              title="car"
            >
              <Image
                source={require('../images/car-marker.png')}
                style={{height: 45, width: 45}}
              ></Image>
            </Marker>
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

    const chatRoom = await queryChatRoom(userID, workTrip.driverID)

    navigation.navigate('ChatRoom', {
      user,
      chatRoom,
      chatRoomTitle: chatRoomName,
    })
  }

  useEffect(() => {
    // Passenger
    if (user.travelPreference === 'passenger') {
      const renderChat = chatRooms.find((chat) => user.id === chat.passengerID)

      if (!renderChat) return

      setLatestMessage(renderChat.latestMessage.text)
    }

    return () => {
      latestMessage
    }
    //if (!isDriving) return navigation.popToTop()
  }, [chatRooms])

  // Render Passenger List at top of the screen
  const renderItem = ({item, index}) => {
    const {stops} = workTrip.scheduledDrive

    const isLastStop =
      stops[workTrip.scheduledDrive.stops.length - 1].stopName === item.stopName

    const renderChat = chatRooms.find(
      (chat) => item.userID === chat.passengerID
    )

    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={styles.leftArrowContainer}>
          <AntDesign name="caretleft" size={24} color={color.lightBlack} />
        </View>
        <View style={styles.listItemContainer}>
          <TouchableOpacity
            disabled={isLastStop}
            onPress={async () => await createChatRoom(item)}
          >
            <View style={styles.listItemTopRow}>
              <View>
                <Text style={styles.nameTopRow}>{item.stopName}</Text>
              </View>
              <View>
                <Text style={styles.distanceTopRow}>2 km</Text>
              </View>
            </View>
            <View
              style={{
                ...styles.listItemMiddleRow,
                justifyContent: isLastStop ? 'flex-end' : 'space-between',
              }}
            >
              {!isLastStop && (
                <View>
                  {renderChat && (
                    <Text style={styles.latestMessageBottomRow}>
                      <Ionicons
                        name="checkmark-done"
                        size={24}
                        color={color.lightBlack}
                      />
                      {renderChat.latestMessage.text}
                    </Text>
                  )}
                </View>
              )}
              <View>
                <Text style={styles.clockTimeContainer}>12:53</Text>
              </View>
            </View>
          </TouchableOpacity>
          {!isLastStop && (
            <View style={styles.listItemBottomRow}>
              <QuickMessagesMenu user={user} workTrip={workTrip} item={item} />
            </View>
          )}
        </View>

        <View style={styles.leftArrowContainer}>
          <AntDesign name="caretright" size={24} color={color.lightBlack} />
        </View>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    )
  }

  return (
    // Passenger
    <View style={styles.container}>
      {user.travelPreference === 'passenger' ? (
        <View style={{...styles.listItemContainer, margin: 15}}>
          <TouchableOpacity onPress={() => createChatRoom(user)}>
            <View style={styles.listItemTopRow}>
              <View>
                <Text style={styles.nameTopRow}>{workTrip.driverName}</Text>
              </View>
              <View>
                <Text style={styles.distanceTopRow}>2 km</Text>
              </View>
            </View>
            <View style={styles.listItemMiddleRow}>
              <View>
                <Text style={styles.latestMessageBottomRow}>
                  <Ionicons
                    name="checkmark-done"
                    size={24}
                    color={color.lightBlack}
                  />
                  {latestMessage}
                </Text>
              </View>
              <View>
                <Text style={styles.clockTimeContainer}>12:53</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.listItemBottomRow}>
            <QuickMessagesMenu
              user={user}
              workTrip={workTrip}
              item={{id: user.id}}
            />
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
          onSnapToItem={(index) => {
            carouselChangeStop(index)
          }}
        />
      )}

      <View style={styles.requestMapContent}>
        <Container style={styles.requestMapContent}>
          <MapView
            ref={mapRef}
            style={styles.mapStyle}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: workTrip.scheduledDrive.stops[0].location.latitude,
              longitude: workTrip.scheduledDrive.stops[0].location.longitude,
              latitudeDelta: 0,
              longitudeDelta: 0,
            }}
          >
            <MapView.Polyline
              coordinates={routeCoordinates}
              strokeColor="#26AAE2"
              strokeWidth={4}
            />
            {markers}

            <DriverMarker workTrip={workTrip} />
          </MapView>
        </Container>
        {user.travelPreference === 'driver' && (
          <>
            {showNextStopBar && (
              <FullWidthButton
                title={'Next Stop'}
                direction={'row'}
                children={<Text>Picked up passenger?</Text>}
                onPress={() => {
                  changeNextStop()
                }}
              ></FullWidthButton>
            )}
            {showStop && (
              <FullWidthButton
                title={'Stop Driving'}
                direction={'row'}
                color={color.radicalRed}
                children={<Text>Destination reached</Text>}
                onPress={() => {
                  stopDriving()
                }}
              ></FullWidthButton>
            )}
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'space-around',
  },
  leftArrowContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  },
  listItemTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  listItemMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
