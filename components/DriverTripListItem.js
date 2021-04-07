import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'

import moment from 'moment'

import {color} from '../constants/colors'

import {checkWhatDayItIs} from '../utils/utils'

const DriverTripListItem = ({singleTrip, navigation}) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.rectStack}>
        <View style={styles.rectangle}>
          <View style={styles.topRow}>
            <Text style={styles.weekDayText}>
              {checkWhatDayItIs(singleTrip.workDayNum)}
            </Text>
            <Text style={styles.stopsText}>
              Stops: {singleTrip.scheduledDrive.stops.length}
            </Text>
          </View>
          <View style={styles.breakPoint}></View>
          <View style={styles.bottomRow}>
            <Text style={styles.arrivalTimeText}>
              Arrival time to {singleTrip.goingTo} -{' '}
              {moment(singleTrip.scheduledDrive.end.toDate()).format('HH:mm')}
            </Text>
          </View>
        </View>
        <View style={styles.leftGoingTo}>
          <View style={styles.leftGoingTop}>
            <Text style={styles.goingToText}>
              {singleTrip.goingTo.charAt(0).toUpperCase() +
                singleTrip.goingTo.slice(1)}
            </Text>
          </View>
          <View style={styles.startTime}>
            <Text>
              {moment(singleTrip.scheduledDrive.start.toDate()).format('HH:mm')}
            </Text>
          </View>
        </View>
      </View>
    </View>
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
  weekDayText: {
    fontFamily: 'open-sans-semi-bold',
    flex: 1,
    color: 'white',
  },
  stopsText: {
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
  breakPoint: {
    height: 1,
    backgroundColor: color.primaryLight,
  },
  arrivalTimeText: {
    fontFamily: 'open-sans-semi-bold',
    color: 'white',
  },
  rect4: {
    top: 6,
    left: 30,
    height: 2,
    backgroundColor: '#E6E6E6',
  },
  arrivalTimeTextStack: {
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
    //  borderRadius: 24,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    padding: 20,
    justifyContent: 'center',
  },
  leftGoingTop: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  startTime: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  goingToText: {
    fontFamily: 'open-sans-semi-bold',
    color: 'black',
  },
  rectStack: {
    marginTop: 20,
  },
})

export default DriverTripListItem
