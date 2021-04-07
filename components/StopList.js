import React from 'react'
import {FlatList} from 'react-native'
import {View} from 'native-base'
import StopListItem from '../components/StopListItem'

export const StopList = ({dataArray, route}) => {
//route.route.routes[0].legs[index]

  return (
    <View>
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <StopListItem singleItem={item} route={route} index={index}/>
        )}
      />
    </View>
  )
}

export default StopList


