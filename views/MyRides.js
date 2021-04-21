import React, {useState} from 'react'
import {View, StyleSheet, ScrollView, TouchableOpacity, Platform, TouchableNativeFeedback, Dimensions} from 'react-native'
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
import CustomButtonIcon from '../components/CustomIconButton'
import {color} from '../constants/colors'
import {checkWhatDayItIs} from '../utils/utils'
import MyRidesWorkDayButton from '../components/MyRidesWorkDayButton'
import MyRidesWorkDayEditDialog from '../components/MyRidesWorkDayEditDialog'
export const MyRides = ({navigation}) => {
  let TouchableCmp = TouchableOpacity

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }
  const workTripActive = true
  const workTripEmpty = false
  const homeTripActive = true

  return (
    <View style={styles.container}>
      <MyRidesWorkDayEditDialog></MyRidesWorkDayEditDialog>
      <View style={{height: 380, flexDirection: 'column'}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          pagingEnabled>

          <MyRidesWorkDayButton></MyRidesWorkDayButton>
          <MyRidesWorkDayButton></MyRidesWorkDayButton>
          <MyRidesWorkDayButton></MyRidesWorkDayButton>
          <MyRidesWorkDayButton></MyRidesWorkDayButton>
          <MyRidesWorkDayButton></MyRidesWorkDayButton>

        </ScrollView>
      </View>
    </View >
  )
}

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
  workDayCard: {
    padding: 10,
    margin: 30,
    width: Dimensions.get('window').width * 0.85,
    height: 280,
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
    width: Dimensions.get('window').width * 0.8,
    height: 120,
    flexDirection: 'column'
  },
  workTripInfoTopRow: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
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
