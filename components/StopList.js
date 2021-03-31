import React from 'react'
import {FlatList} from 'react-native'
import {View} from 'native-base'
import StopListItem from '../components/StopListItem'

export const StopList = ({navigation, dataArray}) => {
  return (
    <View>
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <StopListItem navigation={navigation} singleItem={item} />
        )}
      />
    </View>
  )
}

export default StopList


