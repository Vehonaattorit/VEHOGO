import React, {useEffect, useContext, useState} from 'react'
import {Dimensions, View, Text, ActivityIndicator, FlatList} from 'react-native'

import {Ionicons, FontAwesome5, MaterialIcons} from '@expo/vector-icons'

import MainPageButton from './MainPageButton'
import {color} from '../constants/colors'
import {workTripMultiQuery} from '../controllers/workTripController'
import {Platform} from 'react-native'
import {Alert} from 'react-native'

const MainPageButtons = ({
  user,
  testIDs,
  travelPreference,
  drivingTrips,
  navigation,
}) => {
  const [startingRide, setStartingRide] = useState([])
  const [driveStartTime, setDriveStartTime] = useState(null)

  console.log('testIDs', testIDs)

  const getNextRide = async () => {
    const now = new Date()

    const currentWeekDay = now.getDay() == 0 ? 7 : now.getDay()

    const currentHours = now.getHours()
    const minutes = now.getMinutes()

    let tomorrowWeekDay

    for (let i = 0; i < 7; i++) {
      if (user.preferedWorkingHours[i] != undefined) {
        const preferedWorkingHours = user.preferedWorkingHours[i]

        if (currentWeekDay <= preferedWorkingHours.workDayNum) {
          if (currentWeekDay < user.preferedWorkingHours[i].workDayNum) {
            tomorrowWeekDay = user.preferedWorkingHours[i].workDayNum
            break
          } else {
            tomorrowWeekDay = user.preferedWorkingHours[0].workDayNum
          }
        } else {
          tomorrowWeekDay = user.preferedWorkingHours[0].workDayNum
        }
      }
    }

    const tomorrowWorkTrips = await workTripMultiQuery(user.company.id, [
      {
        field: 'workDayNum',
        condition: '==',
        value: tomorrowWeekDay,
      },
      {
        field: 'driverID',
        condition: '==',
        value: user.id,
      },
    ])

    let found = false
    let nextWorkTrip
    for (let i = 0; i < user.preferedWorkingHours.length; i++) {
      const preferedHours = user.preferedWorkingHours[i]
      if (preferedHours.workDayNum == currentWeekDay) {
        found = true
        break
      }
    }

    if (found) {
      // sorting the morning ride to start
      // 17.04.2021 replaced todayWorkTrips with driverTrips
      if (drivingTrips[0].goingTo == 'home') drivingTrips.reverse()

      for (let i = 0; i < drivingTrips.length; i++) {
        const workTrip = drivingTrips[i]
        const nowInMinutes = currentHours * 60 + minutes
        let startTime = workTrip.scheduledDrive.start.toDate()
        const workTripStartInMinutes =
          startTime.getHours() * 60 + startTime.getMinutes()
        //now is before workTrip start
        if (nowInMinutes < workTripStartInMinutes) {
          //this workTrip is next, display it on the screen
          setDriveStartTime(workTrip.scheduledDrive.start)
          setStartingRide(workTrip)

          return
        }
      }
      if (driveStartTime == null) {
        // next workday morning workTrip is next and displayed on the screen
        if (tomorrowWorkTrips[0].goingTo == 'home') tomorrowWorkTrips.reverse()
        setDriveStartTime(tomorrowWorkTrips[0].scheduledDrive.start)
        setStartingRide(tomorrowWorkTrips[0])

        return
      }
    } else {
      if (tomorrowWorkTrips[0].goingTo == 'home') tomorrowWorkTrips.reverse()
      setDriveStartTime(tomorrowWorkTrips[0].scheduledDrive.start)
      setStartingRide(tomorrowWorkTrips[0])
      return
    }
  }

  const passengerButtons = [
    {
      id: '1',
      title: 'Pending',
      icon: (
        <MaterialIcons
          name="pending-actions"
          size={Dimensions.get('window').width * 0.12}
          color={color.darkBlue}
        />
      ),
      onPress: () => navigation.navigate('PassengerPendingRequestsList'),
    },
    {
      id: '2',
      title: 'Calendar',
      icon: (
        <Ionicons
          name="calendar"
          size={Dimensions.get('window').width * 0.12}
          color={color.darkBlue}
        />
      ),
      onPress: () => navigation.navigate('OutlookCalendar'),
    },
  ]

  const driverButtons = [
    {
      id: '1',
      travelPreference: ['driver'],
      title: 'Requests',
      icon: (
        <FontAwesome5
          name="user-check"
          size={Dimensions.get('window').width * 0.12}
          color={color.darkBlue}
        />
      ),
      onPress: () => navigation.navigate('DriverRideRequestList'),
    },
    {
      id: '2',
      travelPreference: ['driver'],
      title: 'Start Ride',
      icon: (
        <Ionicons
          name="md-car"
          size={Dimensions.get('window').width * 0.12}
          color={color.darkBlue}
        />
      ),
      onPress: () => {
        console.log(startingRide)
        if (startingRide != undefined && startingRide.length > 0) {
          navigation.navigate('DriverStartRide', {
            workTrip: startingRide,
          })
        } else {
          Alert.alert('No rides', 'Currently there are no rides to start.')
        }
      },
    },
    {
      id: '3',
      travelPreference: ['driver'],
      title: 'Cars',
      icon: (
        <FontAwesome5
          name="car-side"
          size={Dimensions.get('window').width * 0.12}
          color={color.darkBlue}
        />
      ),
      onPress: () => navigation.navigate('DriverCarList'),
    },
    {
      id: '4',
      travelPreference: ['passenger', 'driver'],
      title: 'Calendar',
      icon: (
        <Ionicons
          name="calendar"
          size={Dimensions.get('window').width * 0.12}
          color={color.darkBlue}
        />
      ),
      onPress: () => navigation.navigate('OutlookCalendar'),
    },
  ]

  const renderGridItem = (itemData) => {
    const {item} = itemData

    // Calendar does not work on iOS devices
    // if (Platform.OS === 'ios' && item.title === 'Calendar') {
    //   return
    // }

    if (!__DEV__ && item.title === 'Calendar') {
      return
    }

    return (
      <>
        <MainPageButton
          testID={item.testID}
          title={item.title}
          onPress={item.onPress}
        >
          {itemData.item.icon}
        </MainPageButton>
      </>
    )
  }

  useEffect(() => {
    console.log('trips in mainButtons', drivingTrips)
    if (drivingTrips != undefined && drivingTrips.length > 0) {
      getNextRide()
    }
  }, [drivingTrips])

  return (
    <>
      {user.travelPreference === 'passenger' ? (
        <FlatList
          contentContainerStyle={{
            paddingBottom: 80,
            backgroundColor: 'white',
          }}
          keyExtractor={(item, index) => item.id}
          data={passengerButtons}
          renderItem={renderGridItem}
          numColumns={2}
        />
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingBottom: 80,
            backgroundColor: 'white',
          }}
          keyExtractor={(item, index) => item.id}
          data={driverButtons}
          renderItem={renderGridItem}
          numColumns={2}
        />
      )}
    </>
  )
}

export default MainPageButtons
