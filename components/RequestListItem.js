import React, {useEffect, useState} from 'react'
import {Text, View, Button} from 'native-base'
import {StyleSheet, Dimensions, ActivityIndicator, Platform} from 'react-native'
import {color} from '../constants/colors'
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {getWorkTrip} from '../controllers/workTripController'
import {checkWhatDayItIs} from '../utils/utils'
import moment from 'moment'

const RequestListItem = ({user, itemData, viewRequest}) => {
  const {item} = itemData

  const [workTrip, setWorkTrip] = useState(null)

  const getTrip = async () => {
    const data = await getWorkTrip(user.company.id, item.workTripRefID)

    setWorkTrip(data)
  }

  useEffect(() => {
    getTrip()
  }, [])

  if (!workTrip) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    )
  }

  return (
    <View style={styles.listItem}>
      <View style={styles.rectangle}>
        <View style={styles.topRow}>
          <Ionicons name="person-outline" size={24} color={color.lightBlack} />
          <View style={styles.marginLeft}>
            <Text style={styles.userNameText}>{item.userName}</Text>
          </View>
        </View>

        <View style={styles.breakPoint}></View>
        <View style={styles.bottomRow}>
          <Ionicons
            name="location-outline"
            size={24}
            color={color.lightBlack}
          />
          <View style={styles.marginLeft}>
            <Text style={styles.homeAddressText}>{item.homeAddress}</Text>
          </View>
        </View>
        <View style={styles.breakPoint}></View>

        <View style={styles.bottomRow}>
          <Ionicons name="today-outline" size={24} color={color.lightBlack} />
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <View style={styles.marginLeft}>
              <Text style={styles.homeAddressText}>
                {checkWhatDayItIs(item.workDayNum)}
              </Text>
            </View>

            <View style={styles.marginRight}>
              <Ionicons
                name="time-outline"
                size={24}
                color={color.lightBlack}
              />

              <View
                style={{
                  marginLeft: 10,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Text style={styles.homeAddressText}>
                  {moment(item.start.toDate()).format('HH:mm')} -{' '}
                  {moment(item.end.toDate()).format('HH:mm')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.breakPoint}></View>
        <View style={styles.bottomRow}>
          {/* <Ionicons name="today-outline" size={24} color={color.lightBlack} /> */}
          <MaterialCommunityIcons
            name="view-week-outline"
            size={24}
            color={color.lightBlack}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <View style={styles.marginLeft}>
              <Text style={styles.homeAddressText}>
                {workTrip.goingTo.charAt(0).toUpperCase() +
                  workTrip.goingTo.slice(1)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.breakPoint}></View>
        <View style={styles.bottomRow}>
          <Button style={styles.button} onPress={() => viewRequest(item)}>
            <Text style={styles.btntxt}>Show Request</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default RequestListItem

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    flex: 1,
    margin: 15,
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
    elevation: 10,
    borderRadius: 10,
  },
  rectangle: {
    backgroundColor: color.lightBlue,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    borderRadius: 10,
  },
  userNameText: {
    fontFamily: 'open-sans-regular',
    flex: 1,
    color: color.lightBlack,
  },
  homeAddressText: {
    flex: 1,
    fontFamily: 'open-sans-regular',
    color: color.lightBlack,
  },
  topRow: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  breakPoint: {
    height: 1,
    backgroundColor: color.primaryLight,
  },
  arrivalTimeText: {
    fontFamily: 'open-sans-regular',
    color: color.lightBlack,
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
    fontFamily: 'open-sans-regular',
    flex: 1,
    color: color.lightBlack,
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
    fontFamily: 'open-sans-regular',
    flex: 1,
    color: color.lightBlack,
    height: 24,
  },
  marginLeft: {
    flex: 1,
    marginLeft: 10,
  },
  marginRight: {
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  leftGoingTo: {
    top: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: color.lightBlack,
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
    fontFamily: 'open-sans-regular',
    color: 'black',
  },

  button: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: color.darkBlue,
    borderRadius: 10,
  },

  btntxt: {
    fontFamily: 'open-sans-semi-bold',
    color: 'white',
  },
})
