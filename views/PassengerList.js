import React from 'react'
import {FlatList} from 'react-native'
import {View} from 'native-base'
import PassengerListItem from './PassengerListItem'

const PassengerList = ({navigation, dataArray}) => {
  return (
    <View>
      <FlatList
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <PassengerListItem navigation={navigation} singleItem={item} />
        )}
      />
    </View>
  )
}

export default PassengerList
