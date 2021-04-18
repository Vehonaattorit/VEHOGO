import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Text, Platform} from 'react-native'
import {color} from '../constants/colors'
// import {Content, Card, CardItem, Text, Left, Right, Icon} from 'native-base'
import {getUser} from '../controllers/userController'

import {Ionicons} from '@expo/vector-icons'
const StopListItem = ({singleItem, route, index}) => {
  const [stopUserInfo, setStopUserInfo] = useState([])

  if (index === 0) {
  } else {
    //
  }

  const getStopUserInfo = async () => {
    const user = await getUser(singleItem.userID)

    setStopUserInfo(user)
  }
  useEffect(() => {
    getStopUserInfo()
  }, [])

  return (
    <View style={styles.listItem}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="location-outline"
              size={24}
              color={color.lightBlack}
            />
          </View>
          <View style={styles.homeAddressContainer}>
            <Text style={styles.text}>{singleItem.address}</Text>
          </View>
        </View>
        {index === 0 ? (
          <>
            <View style={styles.breakPoint}></View>
            <View style={styles.bottomRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={color.lightBlack}
                />
              </View>
              <View style={styles.passengerNameContainer}>
                <Text style={styles.text}>{singleItem.stopName}</Text>
              </View>
              <View style={styles.routeDistanceContainer}>
                <Text style={styles.text}>Start place</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.breakPoint}></View>
            <View style={styles.bottomRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={color.lightBlack}
                />
              </View>
              <View style={styles.passengerNameContainer}>
                <Text style={styles.text}>{singleItem.stopName}</Text>
              </View>
              <View style={styles.routeDistanceContainer}>
                <Text style={styles.text}>
                  {route.routes[0].legs[index - 1].duration.text} to here
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  listItem: {
    marginTop: 20,
    flex: 1,
    marginHorizontal: 20,
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
    elevation: 14,
  },
  container: {
    backgroundColor: color.lightBlue,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'open-sans-regular',
    color: color.lightBlack,
  },
  topRow: {
    height: 25,
    flexDirection: 'row',
    marginVertical: 20,
  },
  homeAddressContainer: {
    paddingLeft: 10,
    alignItems: 'flex-start',
  },
  routeDistanceContainer: {
    flex: 1,
    paddingRight: 20,
    alignItems: 'flex-end',
  },

  passengerNameContainer: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginLeft: 20,
  },
  availableSeatsContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  breakPoint: {
    height: 1,
    backgroundColor: color.lightBlack,
  },
  leaveTime: {
    fontFamily: 'open-sans-regular',
    flex: 1,
    color: color.lightBlack,
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
  rect5: {
    top: 6,
    left: 32,
    height: 2,
    backgroundColor: '#E6E6E6',
  },

  bottomRow: {
    height: 25,
    flexDirection: 'row',
    marginVertical: 20,
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
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    padding: 20,
    justifyContent: 'center',
  },
})

export default StopListItem
