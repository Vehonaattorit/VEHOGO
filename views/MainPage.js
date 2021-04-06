import React, {useEffect, useContext, useState} from 'react'
import {Alert, StyleSheet} from 'react-native'
import {
  Body,
  View,
  Header,
  Left,
  Platform,
  Text,
  Icon,
  Button,
  Container,
  Title,
  Right,
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
import {updateUser} from '../controllers/userController'

import RideStartBar from '../components/RideStartBar'
import DriverTripList from '../components/DriverTripList'
import DriverIsOnHisWayBar from '../components/DriverIsOnHisWayBar'
import MainPageButtons from '../components/MainPageButtons'

export const MainPage = ({navigation}) => {
  const {user} = useContext(UserContext)
  const [travelPreference, setTravelPreference] = useState('')

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
    driverTripList,
    queryWithTimeAndDriverId,
    fetchTodayDriverRides,
  } = useWorkTripHooks(user)

  useEffect(() => {
    checkTravelPreference()
    checkNotificationsPermissions()
    travelPreference === 'passenger'
      ? fetchTodayRides()
      : fetchTodayDriverRides()
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

    user.ownerPushToken = pushToken
    await updateUser(user)
  }

  const checkTravelPreference = async () => {
    setTravelPreference(user.travelPreference)
  }

  const displayPassengerList = () => {
    if (travelPreference === 'passenger') {
      return (
        <Container>
          <Header>
            <Right>
              <Button
                onPress={() => {
                  setOpen(!open)
                }}
                transparent
              >
                <Icon name="filter" />
              </Button>
            </Right>
          </Header>
          {activeRide && (
            <DriverIsOnHisWayBar
              user={user}
              navigation={navigation}
              activeRide={activeRide}
            />
          )}

          <View style={styles.listView}>
            <PassengerList
              extraDay={extraDay}
              navigation={navigation}
              dataArray={passengerList}
            />
          </View>
        </Container>
      )
    }
  }

  const displayDriverList = () => {
    if (travelPreference === 'driver') {
      return (
        <Container>
          {driverTripList && (
            <RideStartBar user={user} navigation={navigation}></RideStartBar>
          )}

          <View style={styles.listView}>
            <DriverTripList
              extraDay={extraDay}
              navigation={navigation}
              driverTrips={driverTripList}
            />
          </View>
        </Container>
      )
    }
  }

  const drawerContent = () => {
    return (
      <View style={styles.animatedBox}>
        <Text>Start time </Text>
        <Text>Min - Max </Text>
        <MultiSlider
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
        <Text>{`${timeValues[0].hours}:${timeValues[0].minutes} - ${timeValues[1].hours}:${timeValues[1].minutes}`}</Text>

        <View style={{flexDirection: 'row'}}>
          <View style={{marginVertical: 10, marginRight: 10}}>
            <Button
              onPress={
                travelPreference === 'passenger'
                  ? queryWithTime
                  : queryWithTimeAndDriverId
              }
            >
              <Text>Submit</Text>
            </Button>
          </View>
          <View style={{marginVertical: 10, marginRight: 10}}>
            <Button
              style={{backgroundColor: 'firebrick'}}
              onPress={() => {
                setOpen(!open)
              }}
            >
              <Text>Cancel</Text>
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
          <View style={styles.scheduleView}>
            <MainPageButtons
              travelPreference={travelPreference}
              navigation={navigation}
              driverTripList={driverTripList}
            />
          </View>
        </MenuDrawer>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  animatedBox: {
    flex: 1,
    backgroundColor: color.secondary,
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

  listView: {},

  scheduleView: {
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
})
