import React, {useEffect, useContext, useState} from 'react';
import {FlatList} from 'react-native';
import {View} from 'native-base';
import PendingRequestsListItem from './PendingRequestsListItem';
import DriverTripListItem from './DriverTripListItem';
import {workTripQuery} from '../controllers/workTripController'
import {UserContext} from '../contexts'

const DriverTripList = ({driverTrips, navigation}) => {
  return (
    <View>
      <FlatList
        data={driverTrips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) =>
          <DriverTripListItem singleTrip={item} navigation={navigation} />
        }
      />
    </View>
  );
};

export default DriverTripList;
