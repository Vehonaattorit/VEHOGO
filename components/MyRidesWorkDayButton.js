import React, {useEffect, useContext, useState} from 'react'
import {useDocumentDataOnce} from 'react-firebase-hooks/firestore'
import {updateUser} from '../controllers/userController'
import {
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableNativeFeedback
} from 'react-native'
import {UserContext} from '../contexts'
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
import {getWorkTrip, deleteWorkTrip} from '../controllers/workTripController'
import {checkWhatDayItIs, timeFormat} from '../utils/utils'
import {format} from 'prettier'
import fire from '../firebase/fire'
import {removePassengerFromRoute} from '../utils/passengerRemove'

const MyRidesWorkDayButton = ({props}) => {
  const {user} = useContext(UserContext)
  let TouchableCmp = TouchableOpacity
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }
  const disabled = props.workingHour.disabled != undefined
  const workingHour = props.workingHour
  const onClick = props.onClick
  const [workTrip, setWorkTrip] = useState()
  const [homeTrip, setHomeTrip] = useState()
  useEffect(() => {
    getWorkTrips()
  }, [])

  const getWorkTrips = async () => {
    if (props.workingHour.toWorkRefID != undefined) {
      let workTripData = await getWorkTrip(user.company.id, props.workingHour.toWorkRefID)
      setWorkTrip(workTripData)
    }
    if (props.workingHour.toHomeRefID != undefined) {
      let workTripData = await getWorkTrip(user.company.id, props.workingHour.toHomeRefID)
      setHomeTrip(workTripData)
    }
  }

  const addNewWorkTrip = async () => {
    const hours = new Date().getHours()
    console.log('prop num',props.workingHour.workDayNum)
    if (user.preferedWorkingHours.length > 0) {
      let found = false;
      for (let i = 0; i < user.preferedWorkingHours.length; i++) {
        const workingHour = user.preferedWorkingHours[i];
        if (props.workingHour.workDayNum < workingHour.workDayNum) {
          user.preferedWorkingHours.splice(i, 0, {workDayNum: props.workingHour.workDayNum, workDayEnd: workingHour.workDayEnd, workDayStart: workingHour.workDayStart})
          found = true
          break
        }
      }
      if(!found){
        const exampleWorkingHour = user.preferedWorkingHours[0];
        user.preferedWorkingHours.push({workDayNum: props.workingHour.workDayNum, workDayEnd: exampleWorkingHour.workDayEnd, workDayStart: exampleWorkingHour.workDayStart})
      }
    } else {
      user.preferedWorkingHours = [{workDayNum: props.workingHour.workDayNum, workDayEnd: new Date(1970, 0, 1, hours + 1, 0), workDayStart: new Date(1970, 0, 1, hours, 0)}]
    }

    updateUser(user)
  }

  const clearWorkTrip = async () => {
    for (let i = 0; i < user.preferedWorkingHours.length; i++) {
      if (props.workingHour.workDayNum == user.preferedWorkingHours[i].workDayNum) {

        if (workTrip != undefined) {
          if (user.id == workTrip.driverID) {
            console.log('deleting work trip')
            let token = await fire.auth().currentUser.getIdTokenResult()
            workTrip.scheduledDrive.stops.forEach(async stop => {
              const response = await fetch(
                `https://us-central1-veho-go.cloudfunctions.net/deleteWorkTripFromUser`,
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId: stop.userID,
                    idToken: token.token,
                    workTrip: workTrip,
                  }),
                }
              )
            })

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
            await removePassengerFromRoute(workTripUpdate, user.company.id, workTrip)
          }
        }
        console.log('homeTrip',homeTrip)
        console.log('home driver id', homeTrip.driverID)
        console.log('user id', user.id)
        if (homeTrip != undefined) {
          if (user.id == homeTrip.driverID) {
            console.log('deleting home trip')
            let token = await fire.auth().currentUser.getIdTokenResult()
            workTrip.scheduledDrive.stops.forEach(async stop => {
              const response = await fetch(
                `https://us-central1-veho-go.cloudfunctions.net/deleteWorkTripFromUser`,
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId: stop.userID,
                    idToken: token.token,
                    workTrip: workTrip,
                  }),
                }
              )
            })
            await deleteWorkTrip(user.company.id, homeTrip.id)
          } else {

            let homeTripUpdate
            // filter all stops that DON'T HAVE passenger ID
            const stops = homeTrip.scheduledDrive.stops.filter(
              (item) => item.userID !== user.id
            )

            // new stops array without passenger stop
            homeTripUpdate = {
              ...homeTrip,
              scheduledDrive: {
                ...homeTrip.scheduledDrive,
                stops: stops,
              },
            }
            await removePassengerFromRoute(homeTripUpdate, user.company.id, homeTrip)
          }
        }
        user.preferedWorkingHours.splice(i, 1)
        break
      }
    }
    updateUser(user)
  }

  return (
    <View style={[styles.workDayCardSmall, {backgroundColor: disabled ? 'lightgrey' : color.lightBlue}]}>
      <View style={styles.workDayTitle}>
        <Text>{checkWhatDayItIs(props.workingHour.workDayNum)}</Text>
      </View>
      <View style={styles.workTripInfoBottomRow}>
        {disabled ? <View style={[styles.workTripButton, {flex: 1, backgroundColor: color.greyText}]}>
          <View style={styles.workTripInfoBottomRow}>
            <Text style={{paddingTop: 8}}>
              No work trip
              </Text>
          </View>
        </View>
          : <WorkTripCard key={`${props.workingHour.workDayNum}1`} props={{workTrip: workTrip, workTripType: 'work'}}></WorkTripCard>}
      </View>
      <View style={styles.workTripInfoBottomRow}>
        {disabled ? <View style={[styles.workTripButton, {flex: 1, backgroundColor: color.greyText}]}>
          <View style={styles.workTripInfoBottomRow}>
            <Text style={{paddingTop: 8}}>
              No work trip
              </Text>
          </View>
        </View>
          : <WorkTripCard key={`${props.workingHour.workDayNum}2`} props={{workTrip: homeTrip, workTripType: 'home'}}></WorkTripCard>}
      </View>
      <View style={styles.workTripInfoBottomRow}>
        <TouchableCmp onPress={() => disabled ? addNewWorkTrip() : clearWorkTrip()}>
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

  function WorkTripCard({props}) {
    const workTrip = props.workTrip
    const workTripType = props.workTripType
    return (
      <TouchableCmp onPress={() => {onClick(workTrip, workingHour, workTripType)}}>
        <View style={[styles.workTripButton, {flex: 1, backgroundColor: workTrip == undefined ? '#FFD101' : 'white', alignItems: 'stretch', paddingTop: 8}]}>
          <View style={styles.workTripInfoBottomRow}>
            {workTrip == undefined ?
              <Text>
                No work trip
          </Text> :
              <>
                <Text>
                  {workTrip && (workTrip.goingTo == 'work' ? timeFormat(workTrip.scheduledDrive.end.toDate()) : timeFormat(workTrip.scheduledDrive.start.toDate()))}
                </Text>
                <FontAwesome5
                  name='edit'
                  size={25}
                  color={color.darkBlue}
                ></FontAwesome5>
              </>}

          </View>
        </View>
      </TouchableCmp>
    )

  }

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
