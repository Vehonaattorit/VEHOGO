import React from 'react'
import {FlatList} from 'react-native'
import {View} from 'native-base'
import PassengerListItem from './PassengerListItem'

const PassengerList = ({extraDay, navigation, dataArray}) => {
  return (
    <View>
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <PassengerListItem
            navigation={navigation}
            singleItem={{...item, extraDay}}
          />
        )}
      />
    </View>
  )
}

export default PassengerList
