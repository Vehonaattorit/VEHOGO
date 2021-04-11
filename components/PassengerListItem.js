import React from 'react'
import {
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import {color} from '../constants/colors'
import moment from 'moment'

const PassengerListItem = ({navigation, singleItem}) => {
  const {driverName, goingTo, scheduledDrive, workDayNum, extraDay} = singleItem

  console.log('singleItem', driverName)

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
          <View style={styles.workBlock}>
            <View style={styles.topRow}>
              <Text style={styles.goingToText}>
                To {goingTo.charAt(0).toUpperCase() + goingTo.slice(1)}
              </Text>
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.leaveTime}>
                {moment(scheduledDrive.start.toDate()).format('HH:mm')}
              </Text>
            </View>
          </View>
          <View style={styles.weekDayBlock}>
            <View style={styles.topRow}>
              <Text style={styles.driverNameText}>{driverName}</Text>
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.arrivalTimeText}>
                Arrival time:{' '}
                {moment(scheduledDrive.end.toDate()).format('HH:mm')}
              </Text>
            </View>
          </View>
          <View style={styles.takenSeatsBlock}>
            <View style={styles.passengerTextContainer}>
              <MaterialCommunityIcons
                name="seat-passenger"
                size={30}
                color={color.lightBlack}
              />
            </View>
            <View style={styles.passengerTextContainer}>
              <Text style={styles.takenSeatsText}>
                {scheduledDrive.takenSeats}/4
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  goingToText: {
    fontFamily: 'open-sans-semi-bold',
    color: 'white',
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
  takenSeatsBlock: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: color.middleBlue,
  },

  driverNameText: {
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
  passengerTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  takenSeatsText: {
    fontSize: 20,
    fontFamily: 'open-sans-semi-bold',
    color: 'white',
  },
  leaveTime: {
    fontSize: 16,
    fontFamily: 'open-sans-regular',
    color: 'white',
  },
})

export default PassengerListItem
