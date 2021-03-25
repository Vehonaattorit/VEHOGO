import React, {useState, useContext} from 'react'
import {StyleSheet, Platform, Text, Button, View} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {color} from '../constants/colors'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'

export const WorkingHours = ({navigation}) => {
  const [date, setDate] = useState(new Date(1598051730000))
  const [mode, setMode] = useState('time')
  const [show, setShow] = useState(false)
  const [selectedTime, setSelectedTime] = useState(null)
  const {user} = useContext(UserContext)
  console.log(selectedTime)

  const updateWorkHours = () => {
    const workingHours = user.preferedWorkingHours
    const preferedWorkDays = []
    workingHours.forEach(element => {
      const dayAndHours = {
        workDayNum: element.workDayNum,
        workDayStart: new Date(1598051730000),
        workDayEnd: new Date(1598051730000)
      }
      preferedWorkDays.push(dayAndHours)
      console.log(dayAndHours)
    });

    user.preferedWorkingHours = preferedWorkDays
    updateUser(user)

  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
  }

  console.log(date)
  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const showStartingDatepicker = () => {
    showMode('time')
  }

  const showEnfingTimepicker = () => {
    showMode('time')
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
      <View style={styles.btns}>
        <View style={styles.timeContainer}>
          <View style={styles.btnContainers}>
            <CustomButton
              onPress={showStartingDatepicker}
              title="Starting Time"
            />
          </View>
          <View style={styles.btnContainers}>
            <CustomButton onPress={showEnfingTimepicker} title="Ending Time" />
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              selected={selectedTime}
              onChange={() => {time => setSelectedTime(time.timeStamp)}}
              dateFormat = 'dd/MM/yyyy'
            />
          )}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
})
