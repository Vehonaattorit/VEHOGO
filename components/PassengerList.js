import React, {useEffect, useState} from 'react'
import {StyleSheet, FlatList, ActivityIndicator} from 'react-native'
import {View} from 'native-base'
import PassengerListItem from './PassengerListItem'
import moment from 'moment'
import {color} from '../constants/colors'

const PassengerList = ({isLoading, user, extraDay, navigation, dataArray}) => {
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
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <PassengerListItem
            navigation={navigation}
            user={user}
            singleItem={{
              ...item,
              extraDay,
            }}
          />
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

export default PassengerList
