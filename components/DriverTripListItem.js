import React from 'react'
import {StyleSheet, Text, View, Platform} from 'react-native'

import moment from 'moment'

import {color} from '../constants/colors'

import {checkWhatDayItIs} from '../utils/utils'

const DriverTripListItem = ({singleTrip, navigation}) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.rectStack}>
        <View style={styles.workBlock}>
          <View style={styles.topRow}>
            <Text style={styles.goingToText}>
              {singleTrip.goingTo.charAt(0).toUpperCase() +
                singleTrip.goingTo.slice(1)}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.leaveTime}>
              {moment(singleTrip.scheduledDrive.start.toDate()).format('HH:mm')}
            </Text>
          </View>
        </View>
        <View style={styles.weekDayBlock}>
          <View style={styles.topRow}>
            <Text style={styles.weekDayText}>
              {checkWhatDayItIs(singleTrip.workDayNum)}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.arrivalTimeText}>
              Arrival time:{' '}
              {moment(singleTrip.scheduledDrive.end.toDate()).format('HH:mm')}
            </Text>
          </View>
        </View>
        <View style={styles.stopsBlock}>
          <View style={styles.stopsContainer}>
            <Text style={styles.goingToText}>Stops</Text>
          </View>
          <View style={styles.stopsAmountContainer}>
            <Text style={styles.stopsText}>
              {singleTrip.scheduledDrive.stops.length}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  listItem: {
    margin: 15,
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
    elevation: 14,
    flex: 1,
  },
  rectStack: {
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
  },
  workBlock: {
    flex: 1,
    backgroundColor: color.darkBlue,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  weekDayBlock: {
    flex: 2,
    backgroundColor: color.lightBlue,
  },
  stopsBlock: {
    flex: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: color.middleBlue,
  },

  weekDayText: {
    fontFamily: 'open-sans-semi-bold',
    color: color.lightBlack,
  },
  stopsText: {
    textAlign: 'center',
    fontSize: 26,
    fontFamily: 'open-sans-regular',
    color: color.lightBlack,
  },
  topRow: {
    paddingLeft: 10,
    paddingTop: 10,
  },
  arrivalTimeText: {
    fontSize: 16,
    fontFamily: 'open-sans-semi-bold',
    color: color.lightBlack,
  },

  atPassengersText: {
    fontFamily: 'open-sans-semi-bold',
    flex: 1,
    color: color.lightBlack,
    height: 24,
  },

  atWorkTime: {
    fontFamily: 'open-sans-semi-bold',
    flex: 1,
    color: color.lightBlack,
    height: 24,
  },
  bottomRow: {
    marginTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },

  rightBlock: {
    top: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: color.darkBlue,
    //  borderRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    padding: 16,
  },
  leftGoingTop: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  stopsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  leftGoingBottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  stopsAmountContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  startTimeText: {
    fontFamily: 'open-sans-regular',
  },
  goingToText: {
    fontSize: 16,
    fontFamily: 'open-sans-semi-bold',
    color: 'white',
  },
  leaveTime: {
    fontSize: 16,
    fontFamily: 'open-sans-regular',
    color: 'white',
  },
})

export default DriverTripListItem
