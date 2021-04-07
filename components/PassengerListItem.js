import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon} from 'native-base'

import {TouchableOpacity} from 'react-native'
import moment from 'moment'

import firebase from 'firebase/app'
import {color} from '../constants/colors'

const PassengerListItem = ({navigation, singleItem}) => {
  const {car, goingTo, scheduledDrive, workDayNum, extraDay} = singleItem

  return (
    <TouchableOpacity
      // style={styles.listItem}
      onPress={() =>
        navigation.navigate('RequestRide', {
          singleItem,
        })
      }
    >
      <View style={styles.listItem}>
        <View style={styles.rectStack}>
          <View style={styles.rectangle}>
            <View style={styles.topRow}>
              <View style={styles.driverNameContainer}>
                <Text style={styles.passengerName}>{car.driverName}</Text>
              </View>
              <View style={styles.takenSeatsContainer}>
                <Text style={styles.takenSeats}>
                  {scheduledDrive.takenSeats}/4
                </Text>
              </View>
            </View>
            <View style={styles.breakPoint}></View>
            <View style={styles.bottomRow}>
              <Text style={styles.leaveTime}>
                {moment(scheduledDrive.start.toDate()).format('HH:mm')}
              </Text>
              <Text style={styles.atPassengersText}>???</Text>
              <Text style={styles.atWorkTime}>
                {moment(scheduledDrive.end.toDate()).format('HH:mm')}
              </Text>
            </View>
          </View>
          <View style={styles.leftGoingTo}>
            <Text style={styles.goingToText}>
              {goingTo.charAt(0).toUpperCase() + goingTo.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    marginHorizontal: 20,
  },
  rectangle: {
    backgroundColor: color.primary,
    borderRadius: 24,
  },
  passengerName: {
    fontFamily: 'open-sans-semi-bold',

    flex: 1,
    color: 'white',
  },
  takenSeats: {
    flex: 1,
    fontFamily: 'open-sans-semi-bold',
    color: 'white',
  },
  topRow: {
    height: 25,
    flexDirection: 'row',
    marginVertical: 20,
    marginLeft: 98,
    marginRight: 17,
  },
  driverNameContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  takenSeatsContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  breakPoint: {
    height: 1,
    backgroundColor: color.primaryLight,
  },
  leaveTime: {
    fontFamily: 'open-sans-semi-bold',
    flex: 1,
    color: 'white',
  },
  rect4: {
    top: 6,
    left: 30,
    height: 2,
    backgroundColor: '#E6E6E6',
  },
  leaveTimeStack: {
    height: 25,
  },
  atPassengersText: {
    fontFamily: 'open-sans-semi-bold',
    flex: 1,
    color: 'white',
    height: 24,
  },
  rect5: {
    top: 6,
    left: 32,
    height: 2,
    backgroundColor: '#E6E6E6',
  },
  atPassengersStack: {
    height: 24,
  },
  atWorkTime: {
    fontFamily: 'open-sans-semi-bold',
    flex: 1,
    color: 'white',
    height: 24,
  },
  bottomRow: {
    height: 25,
    flexDirection: 'row',
    marginVertical: 20,
    marginLeft: 98,
    marginRight: 17,
  },
  leftGoingTo: {
    top: 0,
    bottom: 0,
    position: 'absolute',

    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000000',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    padding: 20,
    justifyContent: 'center',
  },
  goingToText: {
    fontFamily: 'open-sans-semi-bold',
    color: 'black',
  },
  rectStack: {
    marginTop: 20,
  },
})

export default PassengerListItem
