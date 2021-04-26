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
import {UserContext} from '../contexts'
import {checkWhatDayItIs, timeFormat} from '../utils/utils'
import {TimeModal} from '../views/WorkingHours'

import {getWorkTrip, deleteWorkTrip} from '../controllers/workTripController'
import {removePassengerFromRoute} from '../utils/passengerRemove'
import {softUpdateUser, updateUser} from '../controllers/userController'

const MyRidesWorkDayEditDialog = ({props}) => {
  const workTrip = props.selectedWorkTrip
  const workingHours = props.selectedPreferedHours
  const workTripType = props.workTripType
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTime, setSelectedTime] = useState('startDate')
  const [isPickerShow, setIsPickerShow] = useState(false)
  const {user} = useContext(UserContext)
  let TouchableCmp = TouchableOpacity

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

  const handleModal = (visibility) => {
    setModalVisible(visibility)
  }

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }
  const workTripActive = true
  const workTripEmpty = false
  const homeTripActive = true

  const [driverText, setDriverText] = useState()
  const [arrivalTime, setArrivalTime] = useState()

  useEffect(() => {
    if (workTrip != undefined) {
      if(workTrip.driverID == user.id)
      setDriverText('You are the driver')
      else
      setDriverText(`Driver name: ${workTrip.driverName}`)


      if (workTrip.driverID != user.id && workTrip.scheduledDrive != undefined) {
        for (let i = 0; i < workTrip.scheduledDrive.stops.length; i++) {
          const element = workTrip.scheduledDrive.stops[i];
          if (element.userID == user.id) {
            setArrivalTime(timeFormat(element.estimatedArrivalTime.toDate()))
          }
        }
      }
    }
  }, [])

  const deleteWorkTrip = async () => {
    if (workTrip != undefined) {
      if (user.id == workTrip.driverID) {
        await deleteWorkTrip(user.company.id, workTrip.id)
      } else {
        let workTripUpdate
        // filter all stops that DON'T HAVE passenger ID
        const stops = workTrip.scheduledDrive.stops.filter(
          (item) => item.userID !== user.id
        )

        // new stops array without passenger stop
        workTripUpdate = {
          ...workTrip,
          scheduledDrive: {
            ...workTrip.scheduledDrive,
            stops: stops,
          },
        }
        workTripUpdate.scheduledDrive.availableSeats += 1

        await removePassengerFromRoute(workTripUpdate, user.company.id, workTrip)
      }
    }


    user.preferedWorkingHours.forEach(element => {

    if (element.toWorkRefID != undefined && element.toWorkRefID != null) {
      if (element.toWorkRefID == workTrip.id) {
        element.toWorkRefID = null
      }
    }
    if (element.toHomeRefID != undefined && element.toHomeRefID != null) {
      if (element.toHomeRefID == workTrip.id) {
        element.toHomeRefID = null
      }
    }
    });
    user.preferedWorkingHours
    updateUser(user)
    props.onCancel()
  }


  return (
    <View style={styles.workDayCard}>
      <TimeModal
        setIsPickerShow={setIsPickerShow}
        isPickerShow={isPickerShow}
        modalVisible={modalVisible}
        handleModal={handleModal}
        value={newEventState[selectedTime]}
        onChange={(e, date) => updateValue(date, selectedTime)}
      />
      <View style={styles.workDayTitle}>
        <Text>{checkWhatDayItIs(workingHours && workingHours.workDayNum)}</Text><Text>To {workTripType}</Text>
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
          <TouchableCmp onPress={() => {
          setModalVisible(true)
          setSelectedTime('endDate')
          setIsPickerShow(true)
        }}>
            <View style={[styles.workTripButton, {alignItems: 'stretch', minWidth: 120}]}>
              <View style={[styles.workTripInfoBottomRow, {alignItems: 'center', borderRadius: 10}]}>
                <Text >
                  {timeFormat(workTripType =='work' ?workingHours.workDayStart.toDate() :workingHours.workDayEnd.toDate())}
                  </Text>
                <FontAwesome5
                  name='clock'
                  size={25}
                  color={color.primary}
                />
              </View>
            </View>
          </TouchableCmp>
        </View>
        <View style={[styles.workTripInfoBottomRow, {backgroundColor: color.lightBlue,minHeight:180, justifyContent: 'space-between', paddingHorizontal: 15}]}>
          {workTrip == undefined ? <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>No work trip setupped yet</Text></View> : <View >
            <Text style={{marginVertical: 10}}>
              {driverText}
            </Text>

            {arrivalTime &&( <Text style={{marginVertical: 10}}> `Picks you up ${arrivalTime}`</Text>)}

            <Text style={{marginVertical: 10}}>
              Arrives to {workTripType} at {timeFormat(workTrip.scheduledDrive.end.toDate())}
          </Text>
          {workTrip.car && <Text style={{marginVertical: 10}}>
              Car is {`${parseInt(workTrip.car.availableSeats)-workTrip.scheduledDrive.availableSeats}/${parseInt(workTrip.car.availableSeats)}`} full {workTrip.scheduledDrive.availableSeats == 0 ? '(car full)':''}
          </Text>}
          </View>}

          {workTrip == undefined
            ? <View />
            : <TouchableCmp onPress={() => {
            console.log('disable / enable')
            deleteWorkTrip()
            }}>
              <View style={[styles.workTripButton, {width: 45, height: 45, backgroundColor: workTripEmpty ? color.platina : color.radicalRed}]}>
                <FontAwesome5
                  name='calendar-times'
                  size={28}
                  color={color.primary}
                />
              </View>
            </TouchableCmp>}
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
        <TouchableCmp onPress={() => props.onCancel()}>
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
