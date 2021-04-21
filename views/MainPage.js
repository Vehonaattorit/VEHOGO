import React, {useEffect, useContext, useState} from 'react'
import {Alert, View, StyleSheet} from 'react-native'
import {
  Body,
  Header,
  Left,
  Platform,
  Text,
  Card,
  Icon,
  Button,
  Container,
  Title,
  Right,
  CardItem,
} from 'native-base'
import {UserContext} from '../contexts'
import {signOut} from '../controllers/LoginController'
import 'firebase/firestore'

import PassengerList from '../components/PassengerList'
import MenuDrawer from 'react-native-side-drawer'
import {color} from '../constants/colors'

import MultiSlider from '@ptomasroos/react-native-multi-slider'
import {useWorkTripHooks} from '../hooks/useHooks'

import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'
import {
  getUser,
  updateUser,
  userDocumentUpdater,
} from '../controllers/userController'

import RideStartBar from '../components/RideStartBar'
import DriverTripList from '../components/DriverTripList'
import DriverIsOnHisWayBar from '../components/DriverIsOnHisWayBar'
import MainPageButtons from '../components/MainPageButtons'

import {
  workTripMultiQueryStream,
  usePassengerListHook,
  workTripMultiQuery,
  passengerWorkTripsMultiQueryStream,
} from '../controllers/workTripController'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import {IconButton} from 'react-native-paper'

import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'

import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import HeaderButton from '../components/CustomHeaderButton'
import firebase from 'firebase/app'
import 'firebase/firestore'

export const MainPage = ({navigation}) => {
  const db = firebase.firestore()
  console.log('Inside MainPage')
  const {user} = useContext(UserContext)
  const [travelPreference, setTravelPreference] = useState('')

  const [driverTrips, setDriverTrips] = useState()

  // CURRENTWEEKDAY
  const [currentWeekDay, setCurrentWeekDay] = useState(new Date().getDay())

  // PASSENGER

  const [passengerTrips, setPassengerTrips] = useState([])
  const [activeRide, setActiveRide] = useState([])
  const [isPassengerLoading, setIsPassengerLoading] = useState(true)

  const fetchActiveRide = async () => {
    let activeRideListener = await db
      .collection('companys')
      .doc(user.company.id)
      .collection('workTrips')

    const querys = [
      {
        field: 'scheduledDrive.stops',
        condition: 'array-contains',
        value: {
          address: user.homeAddress,
          location: user.homeLocation,
          stopName: user.userName,
          userID: user.id,
        },
      },
      {field: 'workDayNum', condition: '==', value: currentWeekDay},
      {field: 'isDriving', condition: '==', value: true},
    ]

    querys.forEach((query) => {
      activeRideListener = activeRideListener.where(
        query.field,
        query.condition,
        query.value
      )
    })

    activeRideListener.onSnapshot((querySnapshot) => {
      const activeRides = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
        }
      })

      if (activeRides[0] === undefined) {
        setActiveRide(null)
      } else {
        setActiveRide(activeRides[0])
      }

      setIsPassengerLoading(false)
    })
  }

  /*const {passengerTrips, activeRide, isLoading} = usePassengerListHook(user, [
    {
      field: 'scheduledDrive.stops',
      condition: 'array-contains',
      value: {
        address: user.homeAddress,
        location: user.homeLocation,
        stopName: user.userName,
        userID: user.id,
      },
    },
    {field: 'workDayNum', condition: '==', value: currentWeekDay},
    {field: 'isDriving', condition: '==', value: true},
  ])*/

  /*console.log(
    'user',
    user.homeAddress,
    user.homeLocation,
    user.userName,
    user.id'
  )*/

  // console.log('activeRide', activeRide)
  // [END]

  const {
    multiSliderValue,
    multiSliderValuesChange,
    queryWithTime,
    fetchTodayRides,
    timeValues,
    open,
    setOpen,
    passengerList,
    // activeRide,
    extraDay,
    // isLoading,
  } = useWorkTripHooks(user)

  //data stream for driver trips

  useEffect(() => {
    const fetchWorkTrips = async () => {
      const workTripsListener = await db
        .collection('companys')
        .doc(user.company.id)
        .collection('workTrips')
        // DOESN'T WORK WITH onSnapshot
        // .withConverter(workTripConverter)
        .orderBy('workDayNum', 'asc')
        .orderBy('scheduledDrive.start', 'asc')
        .onSnapshot((querySnapshot) => {
          const passengerTrips = querySnapshot.docs.map((doc) => {
            return {
              ...doc.data(),
            }
          })

          const newPassengerTrips = []
          for (const passengerTrip of passengerTrips) {
            const isPassengerIncluded = passengerTrip.scheduledDrive.stops.some(
              (item) => {
                return item.userID === user.id
              }
            )

            newPassengerTrips.push({...passengerTrip, isPassengerIncluded})
          }

          setPassengerTrips(newPassengerTrips)

          setIsPassengerLoading(false)
        })
    }

    const driverTripStream = async () => {
      const currentWeekDay = new Date().getDay()
      //const currentWeekDay = 5

      //setCurrentWeekDay(currentWeekDay)

      try {
        var trips = []
        let ref = await workTripMultiQueryStream(user.company.id, [
          {field: 'workDayNum', condition: '==', value: currentWeekDay},
          {field: 'driverID', condition: '==', value: user.id},
        ])

        ref.onSnapshot((querySnapshot) => {
          trips = []
          querySnapshot.forEach((doc) => {
            trips.push(doc.data())
          })
          console.log('state change')
          console.log('trips length', trips.length)
          setDriverTrips(trips)
        })
      } catch (e) {
        console.log(e)
      }
    }

    const checkNotificationsPermissions = async () => {
      let pushToken
      let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS)
      if (statusObj.status !== 'granted') {
        statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      }
      if (statusObj.status !== 'granted') {
        pushToken = null
      } else {
        pushToken = (await Notifications.getExpoPushTokenAsync()).data
      }

      let updatedUser = await getUser(user.id)
      updatedUser.ownerPushToken = pushToken

      await updateUser(updatedUser)
    }

    //checkTravelPreference()
    checkNotificationsPermissions()

    console.log(user.travelPreference)
    if (user.travelPreference === 'driver') {
      driverTripStream()
    }
    if (user.travelPreference === 'passenger') {
      fetchWorkTrips()
      fetchActiveRide()
      // fetchTodayRides()
    }
    return () => {
      console.log('cleaning')
    }
  }, [])

  /*const checkTravelPreference = async () => {
    setTravelPreference(user.travelPreference)
  }*/

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          {user.travelPreference === 'passenger' && (
            <Item
              title="Filter"
              iconComponent={Ionicons}
              iconName="filter"
              onPress={() => setOpen(!open)}
            />
          )}
          <Item
            title="Account Settings"
            iconComponent={MaterialCommunityIcons}
            iconName="account-cog"
            onPress={() => navigation.navigate('Settings')}
          />
          <Item
            title="Account Settings"
            iconComponent={MaterialCommunityIcons}
            iconName="calendar"
            onPress={() => navigation.navigate('MyRides')}
          />
        </HeaderButtons>
      ),
    })
  }, [])

  const displayPassengerList = () => {
    console.log('show passenger list')
    return (
      <Container>
        {/* {activeRide && ( */}
        {/* // DOES NOT WORK PROPERLY. activeRide is not functioning */}
        {activeRide && (
          <DriverIsOnHisWayBar
            user={user}
            navigation={navigation}
            activeRide={activeRide}
          />
        )}
        {/* )} */}

        <View style={styles.availableRidesContainer}>
          <Text style={styles.availableText}>Available Rides</Text>
        </View>

        <View style={styles.listView}>
          <PassengerList
            isLoading={isPassengerLoading}
            user={user}
            extraDay={extraDay}
            navigation={navigation}
            dataArray={passengerTrips}
          />
        </View>
      </Container>
    )
  }

  const displayDriverList = () => {
    if (user.travelPreference === 'driver') {
      return (
        <>
          {driverTrips && (
            <Container>
              <RideStartBar
                user={user}
                navigation={navigation}
                driverTrips={driverTrips}
              ></RideStartBar>

              <View style={styles.listView}>
                <DriverTripList
                  navigation={navigation}
                  driverTrips={driverTrips}
                />
              </View>
            </Container>
          )}
        </>
      )
    }
  }

  const drawerContent = () => {
    return (
      <View style={styles.animatedBox}>
        <Text style={styles.startTime}>Start time </Text>
        <Text style={styles.minMax}>Min - Max </Text>
        <MultiSlider
          selectedStyle={{
            backgroundColor: color.primary,
          }}
          markerStyle={{
            backgroundColor: color.primary,
          }}
          values={[multiSliderValue[0], multiSliderValue[1]]}
          sliderLength={250}
          onValuesChange={multiSliderValuesChange}
          min={0}
          max={2879}
          step={1}
          allowOverlap
          snapped
        />
        {/* <Text>{`${slideTime().startTime} - ${slideTime().endTime}`}</Text> */}
        <Text
          style={styles.text}
        >{`${timeValues[0].hours}:${timeValues[0].minutes} - ${timeValues[1].hours}:${timeValues[1].minutes}`}</Text>

        <View style={{flexDirection: 'row'}}>
          <View style={{marginVertical: 10, marginRight: 10}}>
            <Button
              style={{backgroundColor: color.malachiteGreen}}
              onPress={user.travelPreference === 'passenger' && queryWithTime}
            >
              <Text style={styles.text}>Submit</Text>
            </Button>
          </View>
          <View style={{marginVertical: 10, marginRight: 10}}>
            <Button
              style={{backgroundColor: color.radicalRed}}
              onPress={() => {
                setOpen(!open)
              }}
            >
              <Text style={styles.text}>Cancel</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }

  return (
    <>
      <View style={styles.view}>
        <MenuDrawer
          open={open}
          drawerContent={drawerContent()}
          drawerPercentage={60}
          animationTime={250}
          overlay={true}
          opacity={1}
          position="right"
        >
          {user.travelPreference === 'passenger'
            ? displayPassengerList()
            : displayDriverList()}

          <View>
            {user.travelPreference === 'passenger' ? (
              <MainPageButtons
                user={user}
                travelPreference={user.travelPreference}
                navigation={navigation}
              />
            ) : (
              <MainPageButtons
                user={user}
                travelPreference={user.travelPreference}
                navigation={navigation}
                drivingTrips={driverTrips}
              />
            )}
          </View>
        </MenuDrawer>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'open-sans-regular',
  },
  availableRidesContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    borderBottomWidth: 2,
  },
  availableText: {
    fontSize: 24,
    fontFamily: 'open-sans-regular',
  },
  animatedBox: {
    flex: 1,
    backgroundColor: color.primaryLight,
    zIndex: 999,
    padding: 10,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F04812',
  },
  view: {
    flex: 1,
  },

  listView: {
    flex: 1,
  },

  button: {
    alignSelf: 'center',
    margin: 2,
  },

  titleText: {
    fontSize: 24,
  },

  driverTripList: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
  },
  sortIcon: {
    color: color.darkBlue,
  },
})
