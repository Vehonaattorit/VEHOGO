import React, {useEffect, useContext, useState} from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableNativeFeedback
} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
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

const MyRidesWorkDayEditDialog = (props) => {
  let TouchableCmp = TouchableOpacity

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }
  const workTripActive = true
  const workTripEmpty = false
  const homeTripActive = true
  return (
    <View style={styles.workDayCard}>
      <View style={styles.workDayTitle}>
        <Text>MAANANTAI</Text><Text>TO WORK</Text>
      </View>
      <View style={styles.workTripInfoContainer}>
        <View style={styles.workTripInfoTopRow}>
          <TouchableCmp onPress={() => {console.log('disable / enable')}}>
            <View style={[styles.workTripButton, {alignItems: 'stretch', minWidth: 180}]}>
              <View style={[styles.workTripInfoBottomRow, {alignItems: 'center', borderRadius: 10}]}>
                <Text>
                  Ratsukatu 4</Text>
                <FontAwesome5
                  name='edit'
                  size={25}
                  color={color.primary}
                />
              </View>
            </View>
          </TouchableCmp>
          <TouchableCmp onPress={() => {console.log('disable / enable')}}>
            <View style={[styles.workTripButton, {alignItems: 'stretch', minWidth: 120}]}>
              <View style={[styles.workTripInfoBottomRow, {alignItems: 'center', borderRadius: 10}]}>
                <Text >
                  08:00</Text>
                <FontAwesome5
                  name='clock'
                  size={25}
                  color={color.primary}
                />
              </View>
            </View>
          </TouchableCmp>
        </View>
        <View style={[styles.workTripInfoBottomRow, {backgroundColor: color.lightBlue, justifyContent: 'space-between', paddingHorizontal: 15}]}>
          <View >
            <Text style={{marginVertical: 10}}>
              Driver name: Toni
          </Text>
            <Text style={{marginVertical: 10}}>
              Picks you up at 07:35
          </Text>
            <Text style={{marginVertical: 10}}>
              Arrives at work at 07:55
          </Text>
            <Text style={{marginVertical: 10}}>
              Car is 2/3 full
          </Text>
          </View>

          <TouchableCmp onPress={() => {console.log('disable / enable')}}>
            <View style={[styles.workTripButton, {width: 45, height: 45, backgroundColor: workTripEmpty ? color.platina : color.radicalRed}]}>
              <FontAwesome5
                name='calendar-times'
                size={28}
                color={color.primary}
              />
            </View>
          </TouchableCmp>
        </View>
        <View>
          <View style={styles.workTripInfoBottomRow}>
            <TouchableCmp onPress={() => {console.log('Change workTrip')}}>
              <View style={[styles.workTripButton, {flex: 3, backgroundColor: workTripEmpty ? color.malachiteGreen : color.middleBlue, maxWidth: 230}]}>
                <View style={[styles.workTripInfoBottomRow, {alignItems: 'center', borderRadius: 10}]}>
                  <Text style={{marginRight: 20}}>
                    {workTripEmpty ? 'Add work trip' : 'Change Work trip'}
                  </Text>
                  <FontAwesome5
                    name='edit'
                    size={20}
                    color={color.primary}
                  />
                </View>

              </View>
            </TouchableCmp>
          </View>
        </View>
      </View>
      <View style={[styles.workTripInfoBottomRow, {}]}>
        <TouchableCmp onPress={() => {console.log('Cancel')}}>
          <View style={[styles.workTripButton, {flex: 1, backgroundColor: color.radicalRed}]}>
            <Text >
              Cancel
            </Text>
          </View>
        </TouchableCmp>
        <TouchableCmp onPress={() => {console.log('Save')}}>
          <View style={[styles.workTripButton, {flex: 3, backgroundColor: color.malachiteGreen}]}>
            <Text style={{color: workTripEmpty ? color.greyText : 'black'}}>
              Save
            </Text>
          </View>
        </TouchableCmp>
      </View>
    </View>
  )
}

export default MyRidesWorkDayEditDialog

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  workDayCard: {
    zIndex: 2,
    position: 'absolute',
    padding: 10,
    margin: 30,
    width: Dimensions.get('window').width * 0.9,
    height: 450,
    backgroundColor: 'white',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: color.grey,
    marginBottom: 10,
  },
  workDayOffButton: {
    backgroundColor: color.radicalRed,
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 65
  },
  workTripInfoContainer: {
    flex: 3,
    width: Dimensions.get('window').width * 0.85,
    height: 120,
    flexDirection: 'column'
  },
  workTripInfoTopRow: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  workTripInfoBottomRow: {
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  workTripButton: {
    padding: 10,
    backgroundColor: color.middleBlue,
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
})