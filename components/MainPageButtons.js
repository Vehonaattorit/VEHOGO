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
      keyExtractor={(item, index) => item.id}
      data={CATEGORIES}
      renderItem={renderGridItem}
      numColumns={2}
    />
  )
}

export default MainPageButtons
