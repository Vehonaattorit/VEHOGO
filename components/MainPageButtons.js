import React from 'react'
import {Dimensions, FlatList} from 'react-native'

import {Ionicons, FontAwesome5} from '@expo/vector-icons'

import MainPageButton from './MainPageButton'
import {color} from '../constants/colors'

const MainPageButtons = ({travelPreference, driverTripList, navigation}) => {
  console.log('travelPreference', travelPreference)

  const mainPageButtons = [
    {
      id: '1',
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
    {
      id: '2',
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
      id: '3',
      travelPreference: ['driver'],
      title: 'Start Ride',
      icon: (
        <Ionicons
          name="md-car"
          size={Dimensions.get('window').width * 0.12}
          color={color.darkBlue}
        />
      ),
      onPress: () =>
        navigation.navigate('DriverStartRide', {
          startingRide: driverTripList[0],
        }),
    },
    {
      id: '4',
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
  ]
  const renderGridItem = (itemData) => {
    const travelPref = itemData.item.travelPreference.some((trav) =>
      trav.includes(travelPreference)
    )

    if (travelPref)
      return (
        <MainPageButton
          title={itemData.item.title}
          onPress={itemData.item.onPress}
        >
          {itemData.item.icon}
        </MainPageButton>
      )
  }

  return (
    <FlatList
      contentContainerStyle={{
        paddingBottom: 80,
        backgroundColor: 'white',
      }}
      keyExtractor={(item, index) => item.id}
      data={mainPageButtons}
      renderItem={renderGridItem}
      numColumns={2}
    />
  )
}

export default MainPageButtons
