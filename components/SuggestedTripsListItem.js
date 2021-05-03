import React, {useEffect, useState, useContext, FlatList} from 'react'
import {View, StyleSheet} from 'react-native'
import {color} from '../constants/colors'
import {
  Card,
  CardItem,
  Text,
  Left,
  Right,
  Icon,
  Button,
} from 'native-base'
import {checkWhatDayItIs, timeFormat, drivingTime} from '../utils/utils'


export const SuggestedTripsListItem = ({singleItem, navigation}) => {

  const schedStart = new Date(singleItem.scheduledDrive.start.toDate())
  const totalTime = drivingTime(singleItem)
  const arrivalTime = schedStart.setMinutes(schedStart.getMinutes() + totalTime)

  console.log('time arriving',arrivalTime)
  const isPassengerIncluded = false
  console.log('length', singleItem.scheduledDrive.stops.length)
  return (
    <View>
      <Card style={styles.list}>
        <CardItem style={styles.item}>
          <Left>
            <Icon name="person" size={24} color={color.lightBlack} />
            <Text style={styles.title}>{singleItem.driverName}</Text>
          </Left>
          <Right>
            <Button
              style={{backgroundColor: color.cyan, borderRadius: 5}}
              onPress={() => {
                navigation.navigate('RequestRide', {
                  singleItem,
                  isPassengerIncluded,
                  arrivalTime,
                })
                console.log('showing')
              }
            }
            >
              <Text style={styles.text}>Show Trip</Text>
            </Button>
          </Right>
        </CardItem>
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="time-outline" />
            <Text style={styles.title}>Start time: {timeFormat(singleItem.scheduledDrive.start.toDate())}</Text>
          </Left>
          <Right>
            <Text style={styles.title}>{checkWhatDayItIs(singleItem.workdayNum)}</Text>
          </Right>
        </CardItem>
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="location-outline" />
            <Text style={styles.title}>To {singleItem.goingTo}</Text>
          </Left>
          <Right>
            <Text style={styles.title}>Open seats: {singleItem.scheduledDrive.availableSeats}</Text>
          </Right>
        </CardItem>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'open-sans-regular',
  },
  title: {
    fontFamily: 'open-sans-regular',
    fontSize: 16,
    color: 'black',
  },
  list: {
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#E1F5FD',
    borderRadius: 20,
  },
  item: {
    backgroundColor: color.lightBlue,
    borderRadius: 10,
  },
})
