import React from 'react'
import {Text, View, Button} from 'native-base'
import {StyleSheet, Dimensions, Platform} from 'react-native'
import {color} from '../constants/colors'
import {Ionicons} from '@expo/vector-icons'

const RequestListItem = ({itemData, viewRequest}) => {
  const {item} = itemData

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
          <Ionicons name="location" size={24} color={color.lightBlack} />
          <View style={styles.marginLeft}>
            <Text style={styles.homeAddressText}>{item.homeAddress}</Text>
          </View>
        </View>
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
    marginLeft: 10,
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
