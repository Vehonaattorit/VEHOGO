import React from 'react'
import {Text, View, Button} from 'native-base'
import {StyleSheet, Dimensions} from 'react-native'
import {color} from '../constants/colors'

const RequestListItem = ({itemData, viewRequest}) => {
  const {item} = itemData

  return (
    <View style={styles.listItem}>
      <View style={styles.rectStack}>
        <View style={styles.rectangle}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.userNameText}>{item.userName}</Text>
            </View>
            <View>
              <Text numberOfLines={2} style={styles.homeAddressText}>
                {item.homeAddress}
              </Text>
            </View>
          </View>
          <View style={styles.breakPoint}></View>
          <View style={styles.middleRow}>
            <Button style={styles.button} onPress={() => viewRequest(item)}>
              <Text style={styles.btntxt}>Show Request</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RequestListItem

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    marginHorizontal: 20,
  },
  rectangle: {
    backgroundColor: color.primary,
    borderRadius: 24,
  },
  userNameText: {
    fontFamily: 'open-sans-regular',
    flex: 1,
    color: 'white',
  },
  homeAddressText: {
    flex: 1,
    fontFamily: 'open-sans-regular',
    color: 'white',
  },
  topRow: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
  },
  breakPoint: {
    height: 1,
    backgroundColor: color.primaryLight,
  },
  arrivalTimeText: {
    fontFamily: 'open-sans-regular',
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
    fontFamily: 'open-sans-regular',
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
    fontFamily: 'open-sans-regular',
    flex: 1,
    color: 'white',
    height: 24,
  },
  middleRow: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
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
    fontFamily: 'open-sans-regular',
    color: 'black',
  },
  rectStack: {
    marginTop: 20,
  },

  button: {
    backgroundColor: color.primaryLight,
    borderRadius: 15,
  },

  btntxt: {
    color: color.primary,
  },
})
