import React, {useEffect, useContext, useState} from 'react'
import {FlatList, ActivityIndicator, StyleSheet} from 'react-native'
import {View} from 'native-base'
import PendingRequestsListItem from './PendingRequestsListItem'
import DriverTripListItem from './DriverTripListItem'
import {workTripQuery} from '../controllers/workTripController'
import {UserContext} from '../contexts'
import {color} from '../constants/colors'

const DriverTripList = ({isLoading, driverTrips, navigation}) => {
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    )
  }
  return (
    <View>
      <FlatList
        data={driverTrips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <DriverTripListItem singleTrip={item} navigation={navigation} />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default DriverTripList
