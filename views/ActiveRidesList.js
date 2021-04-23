import React, {useEffect, useContext, useState} from 'react'
import {SafeAreaView, StyleSheet, FlatList} from 'react-native'
import {
  Content,
  Card,
  CardItem,
  Body,
  Container,
  View,
  Text,
  Icon,
  Button,
  Title,
} from 'native-base'
import {getCars} from '../controllers/carController'
// import ActiveRideListItem from '../components/ActiveRideListItem'
import {UserContext} from '../contexts'
import NewRideForm from './NewRideForm'

import ActiveRidesListItem from '../components/ActiveRidesListItem'

export const ActiveRidesList = ({navigation, route}) => {
  const {workTrip} = route.params

  return (
    <View style={styles.view}>
      <View style={styles.listView}>
        <FlatList
          data={workTrip}
          renderItem={({item}) => (
            <ActiveRidesListItem workTrip={item} navigation={navigation} />
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },

  listView: {
    flex: 1,
    margin: 10,
  },

  button: {
    marginTop: 10,
  },
})
