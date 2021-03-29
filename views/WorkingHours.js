import React, {useState, useContext} from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Text,
  View,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'

import {color} from '../constants/colors'

import {formatTime} from '../utils/utils'

const DateTimeInput = (props) => {
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios')

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
      bac
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

  const [newEventState, setNewEventState] = useState({
    startDate:
      user.preferedWorkingHours === undefined
        ? null
        : user.preferedWorkingHours[0].workDayStart.toDate(),
    endDate:
      user.preferedWorkingHours === undefined
        ? null
        : user.preferedWorkingHours[0].workDayEnd.toDate(),
  })

  const updateValue = (newValue, fieldName) => {
    setIsPickerShow(false)
    setNewEventState({
      ...newEventState,
      [fieldName]: newValue,
    })
  }

  const [modalVisible, setModalVisible] = useState(false)

  const updateWorkHours = () => {
    const {startDate, endDate} = newEventState

    let tempArr = []

    user.workDays.forEach((element) => {
      tempArr.push({
        workDayNum: element.workDayNum,
        workDayStart: new Date(startDate),
        workDayEnd: new Date(endDate),
      })
    })

    user.preferedWorkingHours = tempArr

    updateUser(user)
  }

  const handleModal = (visibility) => {
    setModalVisible(visibility)
  }

  const [selectedTime, setSelectedTime] = useState('startDate')
  const [isPickerShow, setIsPickerShow] = useState(false)

  return (
    <View style={styles.container}>
      <TimeModal
        isPickerShow={isPickerShow}
        modalVisible={modalVisible}
        handleModal={handleModal}
        value={newEventState[selectedTime]}
        onChange={(e, date) => updateValue(date, selectedTime)}
      />

      <CustomTitle style={styles.title} title="Hours" />
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name="clock-fast"
          size={300}
          color={color.secondaryDark}
        />
      </View>
      <View>
        <Text>My work hours</Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          width: 300,
        }}
      >
        <View style={styles.btnContainer}>
          <CustomButton
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
        </View>
        <View style={styles.btnContainer}>
          <CustomButton
            title={
              newEventState.endDate
                ? formatTime(newEventState.endDate)
                : 'End time'
            }
            onPress={() => {
              setModalVisible(true)
              setSelectedTime('endDate')
              setIsPickerShow(true)
            }}
          />
        </View>
      </View>
      <View style={styles.btnContainer}>
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

  btnContainer: {
    margin: 20,
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
})
