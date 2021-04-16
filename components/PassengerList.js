import React, {useEffect, useState} from 'react'
import {StyleSheet, FlatList, ActivityIndicator} from 'react-native'
import {View} from 'native-base'
import PassengerListItem from './PassengerListItem'
import moment from 'moment'
import {color} from '../constants/colors'

const PassengerList = ({isLoading, user, extraDay, navigation, dataArray}) => {
  // const [passengerListByWeekDay, ]
  const [messages, setMessages] = useState([])

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    )
  }

  const renderItem = ({item, index}) => {
    let addAsNewMsg = true

    const lastMessage = dataArray.slice(index - 1)[0]

    if (lastMessage && lastMessage.workDayNum === item.workDayNum) {
      // The last message was also sent by the same user
      // Check if it arrived withing the grouping threshold duration (60s)
      return (
        <PassengerListItem
          navigation={navigation}
          user={user}
          singleItem={{
            ...item,
            extraDay,
            isSameWeekDay: false,
            // isSameWeekDay,
          }}
        />
      )
    }
    if (addAsNewMsg) {
      return (
        <PassengerListItem
          navigation={navigation}
          user={user}
          singleItem={{
            ...item,
            extraDay,
            isSameWeekDay: true,
            // isSameWeekDay,
          }}
        />
      )
    }
  }

  return (
    <View>
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
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
