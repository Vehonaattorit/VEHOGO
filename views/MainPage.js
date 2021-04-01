import React, {useEffect, useContext, useState} from 'react'
import {Alert, StyleSheet} from 'react-native'
import {
  Body,
  View,
  Header,
  Left,
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

import PassengerList from './PassengerList'
import MenuDrawer from 'react-native-side-drawer'
import {color} from '../constants/colors'

import MultiSlider from '@ptomasroos/react-native-multi-slider'
import {useWorkTripHooks} from '../hooks/useHooks'

import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'
import {updateUser} from '../controllers/userController'

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
    extraDay,
  } = useWorkTripHooks(user)

  useEffect(() => {
    checkTravelPreference()
    checkNotificationsPermissions()
    // createAsManyWorkTripDocuments()
    if (travelPreference === 'passenger') fetchTodayRides()
  }, [travelPreference])

  const checkNotificationsPermissions = async () => {
    let pushToken

    let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    if (statusObj.status !== 'granted') {
      statusObj = Permissions.askAsync(Permissions.NOTIFICATIONS)
    }
    if (statusObj.status !== 'granted') {
      pushToken = null
    } else {
      pushToken = (await Notifications.getExpoPushTokenAsync()).data
    }

    user.ownerPushToken = pushToken

    updateUser(user)
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
            <Button onPress={queryWithTime}>
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
          {displayPassengerList()}
          <View style={styles.scheduleView}>
            <Button
              style={styles.button}
              onPress={() => navigation.navigate('OutlookCalendar')}
            >
              <Text>Calender</Text>
            </Button>
            <Button style={styles.button} onPress={signOut}>
              <Text>LogOut</Text>
            </Button>
            <Button
              style={styles.button}
              onPress={() => navigation.navigate('DriverRideRequestList')}
            >
              <Text>Ride requests</Text>
            </Button>
            <Button
              style={styles.button}
              onPress={() => navigation.navigate('DriverStartRide')}
            >
              <Text>Start Ride</Text>
            </Button>
            <Button
              style={styles.button}
              onPress={() => navigation.navigate('DriverCarList')}
            >
              <Text>DriverCarList</Text>
            </Button>
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
