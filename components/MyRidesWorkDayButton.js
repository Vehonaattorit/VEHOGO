import React, {useEffect, useContext, useState} from 'react'
import {
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableNativeFeedback
} from 'react-native'
import {
  Body,
  Header,
  Left,
  Text,
  Card,
  Icon,
  Button,
  Container,
  Title,
  Right,
  CardItem,
} from 'native-base'
import {Ionicons, FontAwesome5} from '@expo/vector-icons'
import {color} from '../constants/colors'

const MyRidesWorkDayButton = (props) => {
  let TouchableCmp = TouchableOpacity

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }
  const disabled = false
  return (
    <View style={[styles.workDayCardSmall, {backgroundColor: disabled ? 'lightgrey' : color.lightBlue}]}>
      <View style={styles.workDayTitle}>
        <Text>MAANANTAI</Text>
      </View>
      <View style={styles.workTripInfoBottomRow}>
        {disabled ? <View style={[styles.workTripButton, {flex: 1, backgroundColor: color.greyText}]}>
          <View style={styles.workTripInfoBottomRow}>
            <Text style={{paddingTop: 8}}>
              No work trip
              </Text>
          </View>
        </View>
          : <TouchableCmp onPress={() => {console.log('disable / enable')}}>
            <View style={[styles.workTripButton, {flex: 1, backgroundColor: 'white', alignItems: 'stretch', paddingTop: 8}]}>
              <View style={styles.workTripInfoBottomRow}>
                <Text>
                  08:00
                </Text>
                <FontAwesome5
                  name='edit'
                  size={25}
                  color={color.darkBlue}
                />
              </View>
            </View>
          </TouchableCmp>}
      </View>
      <View style={styles.workTripInfoBottomRow}>
        {disabled ? <View style={[styles.workTripButton, {flex: 1, backgroundColor: color.greyText}]}>
          <View style={styles.workTripInfoBottomRow}>
            <Text style={{paddingTop: 8}}>
              No work trip
              </Text>
          </View>
        </View>
          : <TouchableCmp onPress={() => {console.log('disable / enable')}}>
            <View style={[styles.workTripButton, {flex: 1, backgroundColor: '#FFD101'}]}>
              <View style={styles.workTripInfoBottomRow}>
                <Text style={{paddingTop: 8}}>
                  No work trip
            </Text>
              </View>
            </View>
          </TouchableCmp>}

      </View>
      <View style={styles.workTripInfoBottomRow}>
        <TouchableCmp onPress={() => {console.log('disable / enable')}}>
          <View style={[styles.workTripButton, {flex: 1, backgroundColor: disabled ? color.malachiteGreen : color.radicalRed}]}>
            <View style={styles.workTripInfoBottomRow}>
              <Text style={{paddingTop: 8}}>
                {disabled ? 'Enable' : 'Disable'}
              </Text>
            </View>
          </View>
        </TouchableCmp>
      </View>
    </View>
  )
}

export default MyRidesWorkDayButton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  workDayCardSmall: {
    padding: 10,
    margin: 15,
    width: Dimensions.get('window').width * 0.4,
    height: 230,
    backgroundColor: color.lightBlue,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    borderRadius: 10,
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    shadowColor: 'black',
    elevation: 20,
  },
  workDayTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: color.grey,
    marginBottom: 10,
  },
  workTripInfoBottomRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  workTripButton: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  poweredContainer: {
    margin: 5,
  },
  btn: {
    marginTop: 10,
  },
})
