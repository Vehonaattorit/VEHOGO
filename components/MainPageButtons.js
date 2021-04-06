import React, {useEffect, useContext, useState} from 'react'
import {Alert, FlatList, StyleSheet} from 'react-native'
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

// Ionicons
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
  FontAwesome5,
} from '@expo/vector-icons'

import MainPageButton from './MainPageButton'
import {color} from '../constants/colors'

const MainPageButtons = ({travelPreference, driverTripList, navigation}) => {
  console.log('travelPreference', travelPreference)

  const CATEGORIES = [
    {
      id: '1',
      travelPreference: ['passenger', 'driver'],
      title: 'Calendar',
      iconName: <Ionicons name="calendar" size={80} color="white" />,
      color: color.primary,
      onPress: () => navigation.navigate('OutlookCalendar'),
    },
    {
      id: '2',
      travelPreference: ['driver'],
      title: 'Ride Request',
      iconName: <FontAwesome5 name="user-check" size={80} color="white" />,
      color: color.primary,
      onPress: () => navigation.navigate('DriverRideRequestList'),
    },
    {
      id: '3',
      travelPreference: ['driver'],
      title: 'Start Ride',
      iconName: <Ionicons name="md-car" size={80} color="white" />,
      color: color.primary,
      onPress: () =>
        navigation.navigate('DriverStartRide', {
          startingRide: driverTripList[0],
        }),
    },
    {
      id: '4',
      travelPreference: ['driver'],
      title: 'Driver Car List',
      iconName: <FontAwesome5 name="car-side" size={80} color="white" />,
      color: color.primary,
      onPress: () => navigation.navigate('DriverCarList'),
    },
  ]
  const renderGridItem = (itemData) => {
    const travelPref = itemData.item.travelPreference.some((trav) =>
      trav.includes(travelPreference)
    )

    if (travelPref)
      return (
        <MainPageButton
          title={itemData.item.title}
          color={itemData.item.color}
          onPress={itemData.item.onPress}
        >
          {itemData.item.iconName}
        </MainPageButton>
      )
  }

  return (
    <FlatList
      contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
      keyExtractor={(item, index) => item.id}
      data={CATEGORIES}
      renderItem={renderGridItem}
      numColumns={2}
    />
  )
}

export default MainPageButtons

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  group1: {
    width: 146,
    height: 140,
  },
  calendarContainerPadding: {
    width: 146,
    height: 140,
  },
  calendarContainer: {
    width: 146,
    height: 140,
    backgroundColor: 'rgba(87,90,175,1)',
    borderRadius: 24,
  },
  calendarText: {
    fontFamily: 'open-sans-regular',
    color: 'rgba(255,255,255,1)',
    height: 33,
    width: 121,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 54,
    marginLeft: 12,
  },
  rideRequestsPadding: {
    width: 146,
    height: 140,
    marginLeft: 96,
  },
  group6: {
    width: 146,
    height: 140,
  },
  rideRequestsContainer: {
    width: 146,
    height: 140,
    backgroundColor: 'rgba(87,90,175,1)',
    borderRadius: 24,
  },
  rideRequestsText: {
    fontFamily: 'open-sans-regular',
    color: 'rgba(255,255,255,1)',
    height: 33,
    width: 121,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 38,
    marginLeft: 12,
  },
  firstRow: {
    height: 160,
    flexDirection: 'row',
  },
  startContainerPadding: {
    width: 146,
    height: 140,
    justifyContent: 'center',
  },
  group8: {
    width: 146,
    height: 140,
    alignSelf: 'center',
  },
  startRideContainer: {
    width: 146,
    height: 140,
    backgroundColor: 'rgba(87,90,175,1)',
    borderRadius: 24,
  },
  startRideText: {
    fontFamily: 'open-sans-regular',
    color: 'rgba(255,255,255,1)',
    height: 33,
    width: 121,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 54,
    marginLeft: 12,
  },
  driverContainerPadding: {
    width: 146,
    height: 140,
    marginLeft: 96,
  },
  group10: {
    width: 146,
    height: 140,
  },
  driverCarContainer: {
    width: 146,
    height: 140,
    backgroundColor: 'rgba(87,90,175,1)',
    borderRadius: 24,
  },
  driverCarListText: {
    fontFamily: 'open-sans-regular',
    color: 'rgba(255,255,255,1)',
    height: 33,
    width: 121,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 38,
    marginLeft: 12,
  },
  secondRow: {
    height: 140,
    flexDirection: 'row',
  },
})
