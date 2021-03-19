import React from 'react';
import {FlatList} from 'react-native';
import {View} from 'native-base';
import PassengerListItem from './PassengerListItem';

const PassengerList = ({dataArray}) => {

  return (
    <View>
      <FlatList
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) =>
          <PassengerListItem singleItem={item} />
        }
      />
    </View>
  );
};

export default PassengerList;
