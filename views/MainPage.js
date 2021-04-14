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

import {workTripMultiQueryStream} from '../controllers/workTripController'
import {useCollectionData} from 'react-firebase-hooks/firestore'

import {Ionicons} from '@expo/vector-icons'

import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import HeaderButton from '../components/CustomHeaderButton'

export const MainPage = ({navigation}) => {
  const {user} = useContext(UserContext)
  const [travelPreference, setTravelPreference] = useState('')

  const [driverTrips, setDriverTrips] = useState(null)

  const {
    multiSliderValue,
    multiSliderValuesChange,
    queryWithTime,
    fetchTodayRides,
    timeValues,
    open,
    setOpen,
    passengerList,
    activeRide,
    extraDay,
    isLoading,
  } = useWorkTripHooks(user)

  //data stream for driver trips
  const driverTripStream = () => {
    const currentWeekDay = new Date().getDay()
    let ref = workTripMultiQueryStream(user.company.id, [
      {field: 'workDayNum', condition: '==', value: currentWeekDay},
      {field: 'driverID', condition: '==', value: user.id},
    ])
    ref.onSnapshot((querySnapshot) => {
      var trips = []

      querySnapshot.forEach((doc) => {
        trips.push(doc.data())
      })
      setDriverTrips(trips)
    })
  }

  useEffect(() => {
    checkTravelPreference()
    checkNotificationsPermissions()

    if (travelPreference === 'driver') {
      driverTripStream()
    }
    if (travelPreference === 'passenger') {
      fetchTodayRides()
    }
  }, [travelPreference])

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

  const checkTravelPreference = async () => {
    setTravelPreference(user.travelPreference)
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Filter"
            iconComponent={Ionicons}
            iconName="filter"
            onPress={() => setOpen(!open)}
          />
        </HeaderButtons>
      ),
    })
  }, [])

  const displayPassengerList = () => {
    return (
      <Container>
        {/* {activeRide && ( */}
        {/* // DOES NOT WORK PROPERLY. activeRide is not functioning */}
        <DriverIsOnHisWayBar
          user={user}
          navigation={navigation}
          activeRide={activeRide}
        />
        {/* )} */}

        <View style={styles.availableRidesContainer}>
          <Text style={styles.availableText}>Available Rides</Text>
        </View>

        <View style={styles.listView}>
          <PassengerList
            isLoading={isLoading}
            extraDay={extraDay}
            navigation={navigation}
            dataArray={passengerList}
          />
        </View>
      </Container>
    )
  }

  const displayDriverList = () => {
    if (travelPreference === 'driver') {
      return (
        <Container>
          {driverTrips && (
            <RideStartBar user={user} navigation={navigation}></RideStartBar>
          )}

          <View style={styles.listView}>
            <DriverTripList
              isLoading={isLoading}
              extraDay={extraDay}
              navigation={navigation}
              driverTrips={driverTrips}
            />
          </View>
        </Container>
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
              onPress={travelPreference === 'passenger' && queryWithTime}
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
          {travelPreference === 'passenger'
            ? displayPassengerList()
            : displayDriverList()}
          <View>
            <MainPageButtons
              travelPreference={travelPreference}
              navigation={navigation}
              driverTripList={driverTrips}
            />
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
