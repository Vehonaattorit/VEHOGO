import React, {useEffect, useState, useContext} from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Text,
  View,
  Alert,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'
import {AntDesign} from '@expo/vector-icons'
import {color} from '../constants/colors'

import {formatTime} from '../utils/utils'

import firebase from 'firebase'
import CustomButtonIcon from '../components/CustomIconButton'

const DateTimeInput = (props) => {
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios')

  useEffect(() => {
    props.onChange('', new Date())
  }, [])

  return (
    <View style={Platform.OS === 'android' ? styles.dateTime : null}>
      {showTimePicker && (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          mode="time"
          value={props.value || new Date()}
          onChange={(e, date) => {
            setShowTimePicker(Platform.OS === 'ios')
            if (date) props.onChange(e, date)
          }}
        />
      )}
    </View>
  )
}

const TimeModal = ({
  isPickerShow,
  modalVisible,
  handleModal,
  onChange,
  value,
}) => {
  if (Platform.OS === 'android') {
    return (
      <>
        {isPickerShow && (
          <DateTimePicker
            mode="time"
            is24Hour={true}
            onChange={(e, date) => {
              if (date) onChange(e, date)
            }}
            value={value || new Date()}
          />
        )}
      </>
    )
  }

  return (
    <Modal
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.')
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{color: color.primary}}>Select time</Text>

          <DateTimeInput onChange={onChange} value={value} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleModal(!modalVisible)
              }}
            >
              <Text style={{color: color.secondary}}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleModal(!modalVisible)
              }}
            >
              <Text style={{color: color.secondary}}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export const WorkingHours = ({navigation}) => {
  const {user} = useContext(UserContext)

  // If starting and ending time was found in db, set fetched values instead of default

  const [newEventState, setNewEventState] = useState({
    startDate:
      user.preferedWorkingHours[0].workDayStart === undefined
        ? null
        : user.preferedWorkingHours[0].workDayStart.toDate()
        ? user.preferedWorkingHours[0].workDayStart.toDate()
        : user.preferedWorkingHours[0].workDayStart,
    endDate:
      user.preferedWorkingHours[0].workDayEnd === undefined
        ? null
        : user.preferedWorkingHours[0].workDayEnd.toDate()
        ? user.preferedWorkingHours[0].workDayEnd.toDate()
        : user.preferedWorkingHours[0].workDayEnd,
  })

  const updateValue = (newValue, fieldName) => {
    setIsPickerShow(false)
    setNewEventState({
      ...newEventState,
      [fieldName]: newValue,
    })
  }

  const [modalVisible, setModalVisible] = useState(false)

  const [error, setError] = useState(false)

  const submitHandler = () => {
    const {startDate, endDate} = newEventState

    if (!startDate || !endDate) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {text: 'Okay'},
      ])
      setError('Please set your working hours.')

      return
    }
    let tempArr = []

    const start = new Date(
      1970,
      0,
      1,
      startDate.getHours(),
      startDate.getMinutes()
    )

    const end = new Date(1970, 0, 1, endDate.getHours(), endDate.getMinutes())

    user.preferedWorkingHours.forEach((element) => {
      tempArr.push({
        workDayNum: element.workDayNum,
        workDayStart: new firebase.firestore.Timestamp.fromDate(start),
        workDayEnd: new firebase.firestore.Timestamp.fromDate(end),
      })
    })

    user.preferedWorkingHours = tempArr

    updateUser(user)

    navigation.navigate('SetUpInit')
  }

  const handleModal = (visibility) => {
    setModalVisible(visibility)
  }

  const [selectedTime, setSelectedTime] = useState('startDate')
  const [isPickerShow, setIsPickerShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [error])

  return (
    <View style={styles.container}>
      <TimeModal
        isPickerShow={isPickerShow}
        modalVisible={modalVisible}
        handleModal={handleModal}
        value={newEventState[selectedTime]}
        onChange={(e, date) => updateValue(date, selectedTime)}
      />
      <View style={styles.icon}>
        <AntDesign name="clockcircle" size={200} color="#26AAE2" />
      </View>
      <Text style={styles.title}>
        Please enter the time your work starts and ends
      </Text>

      <CustomButtonIcon
        iconOne=""
        title={
          newEventState.startDate
            ? formatTime(newEventState.startDate)
            : 'Start time'
        }
        onPress={() => {
          setModalVisible(true)
          setSelectedTime('startDate')
          setIsPickerShow(true)
        }}
      />

      <CustomButtonIcon
        title={
          newEventState.endDate ? formatTime(newEventState.endDate) : 'End time'
        }
        onPress={() => {
          setModalVisible(true)
          setSelectedTime('endDate')
          setIsPickerShow(true)
        }}
      />

      <Text style={styles.errorText}>{error}</Text>

      <View style={styles.submitBtnContainer}>
        <CustomButtonIcon
          title="Submit"
          onPress={submitHandler}
          iconTwo="keyboard-arrow-right"
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
    backgroundColor: '#fff',
  },
  icon: {
    flex: 0.5,
  },
  title: {
    margin: 15,
    fontSize: 20,
    textAlign: 'center',
  },
  submitBtnContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 40,
  },
  btns: {
    height: 100,
    backgroundColor: 'black',
    alignSelf: 'stretch',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '90%',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  errorText: {
    color: 'red',
  },
})
