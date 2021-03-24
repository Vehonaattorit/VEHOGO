import React from 'react';
import {FlatList} from 'react-native';
import {View} from 'native-base';
import PendingRequestsListItem from './PendingRequestsListItem';

const PendinRequestList = ({dataArray, navigation}) => {

  return (
    <View>
      <FlatList
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) =>
          <PendingRequestsListItem singleItem={item} navigation={navigation} />
        }
      />
    </View>
  );
};

export default PendinRequestList;
