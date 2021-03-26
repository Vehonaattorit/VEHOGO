import React, {useState, useContext} from 'react'
import {StyleSheet, Modal, Platform, Text, Button, View} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {color} from '../constants/colors'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'

import moment from 'moment-timezone'

import firebase from '@firebase/app'
import '@firebase/firestore'

const DateTimeInput = (props) => {
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios')

  const formatTime = (dateTime) => {
    return moment(dateTime).format('h:mm A')
  }

  return (
    <View style={Platform.OS === 'android' ? styles.dateTime : null}>
      {Platform.OS === 'android' && (
        <Text style={styles.time} onPress={() => setShowTimePicker(true)}>
          {formatTime(props.value)}
        </Text>
      )}
      {showTimePicker && (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'compact' : 'default'}
          mode="time"
          value={props.value || new Date()}
          onChange={(e, d) => {
            setShowTimePicker(Platform.OS === 'ios')
            if (d) props.onChange(e, d)
          }}
        />
      )}
    </View>
  )
}

export const WorkingHours = ({navigation}) => {
  const {user} = useContext(UserContext)

  const [newEventState, setNewEventState] = useState({
    startDate: new Date(),
    endDate: new Date(),
  })

  const updateWorkHours = () => {
    const {startDate, endDate} = newEventState

    let preferedWorkingHours = []

    user.workDays.forEach((element) => {
      preferedWorkingHours.push({
        workDayNum: element.workDayNum,
        workDayStart: new Date(startDate),
        workDayEnd: new Date(endDate),
      })
    })

    user.preferedWorkingHours = preferedWorkingHours

    updateUser(user)
  }

  const updateValue = (newValue, fieldName) => {
    setNewEventState({
      ...newEventState,
      [fieldName]: newValue,
    })
  }

  return (
    <View style={styles.container}>
      <CustomTitle title="Hours" />
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name="clock-fast"
          size={300}
          color={color.secondaryDark}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: 350,
        }}
      >
        <View style={{flex: 1, flexDirection: 'column'}}>
          {/* <CustomButton onPress={() => {}} title="Starting time" /> */}
          <Text>Starting time</Text>
          <DateTimeInput
            value={newEventState.startDate}
            onChange={(e, date) => updateValue(date, 'startDate')}
          />
        </View>
        <View style={{flex: 1}}>
          <Text>Finishing time</Text>

          <DateTimeInput
            value={newEventState.endDate}
            onChange={(e, date) => updateValue(date, 'startDate')}
          />
        </View>
      </View>
      <View style={styles.submitBtnContainer}>
        <CustomButton
          title="Submit"
          onPress={() => {
            updateWorkHours()
            navigation.navigate('SetUpInit')
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 100,
  },
  btns: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btnContainers: {
    margin: 5,
  },
  submitBtnContainer: {
    margin: 20,
    alignSelf: 'stretch',
  },
  time: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    color: '#147efb',
    marginRight: 10,
  },
  date: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    color: '#147efb',
  },
  dateTime: {
    flexDirection: 'row',
  },
  formField: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
})
