import React, {useEffect, useContext, useState} from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {
  Text,
} from 'native-base'
import {Ionicons, FontAwesome5} from '@expo/vector-icons'
import {color} from '../constants/colors'
import {UserContext} from '../contexts'
import firebase from 'firebase'
import fire from '../firebase/fire'
import {checkWhatDayItIs, timeFormat} from '../utils/utils'
import {TimeModal} from '../views/WorkingHours'
import {googleMapsApiKey} from '../secrets/secrets'
import {getWorkTrip, deleteWorkTrip, updateWorkTrip} from '../controllers/workTripController'
import {removePassengerFromRoute} from '../utils/passengerRemove'
import {getUser, updateUser} from '../controllers/userController'
import {WorkTrip} from '../models/workTrip'
import {ScheduledDrive} from '../models/scheduleDrive'
import {getCar} from '../controllers/carController'
import {Stop} from '../models/stop'

const MyRidesWorkDayEditDialog = ({props}) => {
  const workTrip = props.selectedWorkTrip
  console.log('edit dialog workTrip',workTrip)
  const [workingHours, setWorkingHours] = useState(props.selectedPreferedHours)
  const workTripType = props.workTripType
  console.log('type',workTripType)
  console.log('working Hours',workingHours)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTime, setSelectedTime] = useState('startDate')
  const [isPickerShow, setIsPickerShow] = useState(false)
  const {user} = useContext(UserContext)
  const db = firebase.firestore()
  let TouchableCmp = TouchableOpacity

  const updateValue = (newValue, fieldName) => {
    console.log('updating value for user id', newValue)

    const userToUpdate = user
    let workingHourUpdateIndex = 0
    for (let i = 0; i < user.preferedWorkingHours.length; i++) {
      if (user.preferedWorkingHours[i].workDayNum == workingHours.workDayNum) {
        workingHourUpdateIndex = i
        break
      }
    }
    let workinghoursToUpdate = workingHours
    if (workTripType == 'work') {
      console.log('updating workday start with index', workingHourUpdateIndex)
      workinghoursToUpdate.workDayStart = firebase.firestore.Timestamp.fromDate(
        newValue
      )

      user.preferedWorkingHours[
        workingHourUpdateIndex
      ].workDayStart = firebase.firestore.Timestamp.fromDate(newValue)
    } else {
      console.log('updating workday end with index', workingHourUpdateIndex)
      workinghoursToUpdate.workDayEnd = firebase.firestore.Timestamp.fromDate(
        newValue
      )
      user.preferedWorkingHours[
        workingHourUpdateIndex
      ].workDayEnd = firebase.firestore.Timestamp.fromDate(newValue)
    }
    setWorkingHours(workinghoursToUpdate)
    setIsPickerShow(false)
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
      if (workTrip.driverID == user.id) setDriverText('You are the driver')
      else setDriverText(`Driver name: ${workTrip.driverName}`)

      if (
        workTrip.driverID != user.id &&
        workTrip.scheduledDrive != undefined
      ) {
        for (let i = 0; i < workTrip.scheduledDrive.stops.length; i++) {
          const element = workTrip.scheduledDrive.stops[i]
          if (element.userID == user.id) {
            setArrivalTime(timeFormat(element.estimatedArrivalTime.toDate()))
          }
        }
      }
    }
  }, [])

  const createNewWorkTrip = async () => {

    let addressNow = ''
    let start
    let startLocation
    let endLocation
    let initialStops = []
    const car = await getCar(user.id, user.schoosedCarID)
    console.log('working hours',workingHours)
    //console.log('user', user)

    if (workTripType == 'work') {
      console.log('inside')
      addressNow = user.homeAddress
      start = workingHours.workDayStart
      startLocation = user.homeLocation
      endLocation = user.company.location
    } else {
      console.log('inside')
      addressNow = user.company.address
      start = workingHours.workDayEnd
      startLocation = user.company.location
      endLocation = user.homeLocation
    }
    console.log('display name',user.name)
    console.log('start location', startLocation)

    if (workTripType == 'work') {
      initialStops.push(
        new Stop({
          address: user.homeAddress,
          stopName: 'Home',
          userID: user.id,
          location: user.homeLocation,
        })
      )
      initialStops.push(
        new Stop({
          address: user.company.address,
          stopName: user.company.name,
          userID: user.id,
          location: user.company.location,
        })
      )

    } else {
      initialStops.push(
        new Stop({
          address: user.company.address,
          stopName: user.company.name,
          userID: user.id,
          location: user.company.location,
        })
      )
      initialStops.push(
        new Stop({
          address: user.homeAddress,
          stopName: 'Home',
          userID: user.id,
          location: user.homeLocation,
        })
      )
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.latitude},${startLocation.longitude}&destination=${endLocation.latitude},${endLocation.longitude}&key=${googleMapsApiKey}`,
      {
        method: 'GET',
        //Request Type
      }
    )

    const responseJson = await response.json()

    const data = responseJson
    let totalTime = 0
    data.routes[0].legs.map((leg) => {
      totalTime += leg.duration.value
    })
    totalTime = parseFloat(totalTime.toFixed(0))

    //let end = new Date(1970, 0, 1, start.toDate().getHours(), 0)
    let end = new Date(start.toDate().getTime() + totalTime * 1000)

    console.log('start', start.toDate())
    console.log('end', end)
    console.log('working hours', workingHours)
    console.log('total time', totalTime)
    console.log('driver car',car)
    console.log('stops', initialStops)
    console.log('start', timeFormat(start.toDate()))
    console.log('address now', addressNow)
    console.log('route',data)

   let workTripId = await updateWorkTrip(user.company.id,
      new WorkTrip({
        car: car,
        driverName: user.userName,
        driverID: user.id,
        goingTo: workTripType,
        isDriving: false,
        route: data,
        currentLocation: addressNow,
        workDayNum: workingHours.workDayNum ,
        scheduledDrive: new ScheduledDrive({
          start: start,
          end: new firebase.firestore.Timestamp.fromDate(end),
          availableSeats: car.availableSeats,
          stops: initialStops,
          nextStop: 1,
        }),
      }))

      let userToUpdate = user

      user.preferedWorkingHours.forEach(element => {
        if (element.workDayNum == workingHours.workDayNum) {

          if (workTripType == 'work') {
            element.toWorkRefID = workTripId
          } else {
            element.toHomeRefID = workTripId
          }
        }
      })

      await updateUser(userToUpdate)
      props.navigation.popToTop()
  }

  const removeWorkTrip = async () => {
    if (workTrip != undefined) {
      if (user.id == workTrip.driverID) {
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
        workTripUpdate.scheduledDrive.availableSeats += 1

        await removePassengerFromRoute(
          workTripUpdate,
          user.company.id,
          workTrip
        )
      }
    }

    //remove refId from the user that deleted workTrip

    user.preferedWorkingHours.forEach((element) => {
      if (element.toWorkRefID != undefined && element.toWorkRefID != null) {
        if (element.toWorkRefID == workTrip.id) {
          delete element.toWorkRefID
        }
      }
      if (element.toHomeRefID != undefined && element.toHomeRefID != null) {
        if (element.toHomeRefID == workTrip.id) {
          delete element.toHomeRefID
        }
      }
    })

    console.log('preferedWorking', user.preferedWorkingHours)
    user.preferedWorkingHours
    updateUser(user)
    //props.onCancel()
    props.navigation.popToTop()
  }

  const getBestRoutes = async() => {
    /*let token = await fire.auth().currentUser.getIdTokenResult()
    const response = await fetch(
      `https://us-central1-veho-go.cloudfunctions.net/getBestRoute`,
      {
        method: 'POST',
        headers: {
          // "Access-Control-Allow-Origin": *,
          mode: 'cors', // no-cors, *cors, same-origin
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workDay: 5,//workdayHere
          idToken: token.token}),
          timeOffset: 15, // time offset with minutes
      }
    )*/

    console.log('best routes')
  }

  return (
    <View style={styles.workDayCard}>
      <TimeModal
        setIsPickerShow={setIsPickerShow}
        isPickerShow={isPickerShow}
        modalVisible={modalVisible}
        handleModal={handleModal}
        value={
          workTripType == 'work'
            ? workingHours.workDayStart.toDate()
            : workingHours.workDayEnd.toDate()
        }
        onChange={(e, date) => updateValue(date, selectedTime)}
      />
      <View style={styles.workDayTitle}>
        <Text>{checkWhatDayItIs(workingHours && workingHours.workDayNum)}</Text>
        <Text>To {workTripType}</Text>
      </View>
      <View style={styles.workTripInfoContainer}>
        {workTrip == undefined &&
        <View style={styles.workTripInfoTopRow}>
          <TouchableCmp
            onPress={() => {
              console.log('disable / enable')
            }}
          >
            <View
              style={[
                styles.workTripButton,
                {alignItems: 'stretch', minWidth: 180},
              ]}
            >
              <View
                style={[
                  styles.workTripInfoBottomRow,
                  {alignItems: 'center', borderRadius: 10},
                ]}
              >
                {workTripType == 'home' ? (
                  <Text>{user.homeAddress.substring(0, 15)}...</Text>
                ):(
                  <Text>{user.company.address.substring(0, 15)}...</Text>
                )
              }
                <FontAwesome5 name="edit" size={25} color={color.primary} />
              </View>
            </View>
          </TouchableCmp>
          <TouchableCmp
            onPress={() => {
              setModalVisible(true)
              setSelectedTime('endDate')
              setIsPickerShow(true)
            }}
          >
            <View
              style={[
                styles.workTripButton,
                {alignItems: 'stretch', minWidth: 120},
              ]}
            >
              <View
                style={[
                  styles.workTripInfoBottomRow,
                  {alignItems: 'center', borderRadius: 10},
                ]}
              >
                <Text>
                  {timeFormat(
                    workTripType == 'work'
                      ? workingHours.workDayStart.toDate()
                      : workingHours.workDayEnd.toDate()
                  )}
                </Text>
                <FontAwesome5 name="clock" size={25} color={color.primary} />
              </View>
            </View>
          </TouchableCmp>
        </View>
        }
        <View
          style={[
            styles.workTripInfoBottomRow,
            {
              backgroundColor: color.lightBlue,
              minHeight: 180,
              justifyContent: 'space-between',
              paddingHorizontal: 15,
            },
          ]}
        >
          {workTrip == undefined ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <Text>No work trip setupped yet</Text>
            </View>
          ) : (
            <View>
              <Text style={{marginVertical: 10}}>{driverText}</Text>

              {arrivalTime && (
                <Text style={{marginVertical: 10}}>
                  {' '}
                  `Picks you up ${arrivalTime}`
                </Text>
              )}

              <Text style={{marginVertical: 10}}>
                Arrives to {workTripType} at{' '}
                {timeFormat(workTrip.scheduledDrive.end.toDate())}
              </Text>
              {workTrip.car && (
                <Text style={{marginVertical: 10}}>
                  Car is{' '}
                  {`${
                    parseInt(workTrip.car.availableSeats) -
                    workTrip.scheduledDrive.availableSeats
                  }/${parseInt(workTrip.car.availableSeats)}`}{' '}
                  full{' '}
                  {workTrip.scheduledDrive.availableSeats == 0
                    ? '(car full)'
                    : ''}
                </Text>
              )}
            </View>
          )}

          {workTrip == undefined ? (
            <View />
          ) : (
            <TouchableCmp
              onPress={() => {
                console.log('disable / enable')
                removeWorkTrip()
              }}
            >
              <View
                style={[
                  styles.workTripButton,
                  {
                    width: 45,
                    height: 45,
                    backgroundColor: workTripEmpty
                      ? color.platina
                      : color.radicalRed,
                  },
                ]}
              >
                <FontAwesome5
                  name="calendar-times"
                  size={28}
                  color={color.primary}
                />
              </View>
            </TouchableCmp>
          )}
        </View>
        <View>
          {workTrip == undefined &&
          <View style={styles.workTripInfoBottomRow}>
            <TouchableCmp
              onPress={() => {
                if (user.travelPreference == 'driver') {
                  console.log('Create new workTrip')
                  createNewWorkTrip()
                } else {
                  // This here for storage
                  // DONT DELETE UNLESS YOU ARE NIKLAS

                  /*let token = await fire.auth().currentUser.getIdTokenResult()
                  const response = await fetch(
                    `https://us-central1-veho-go.cloudfunctions.net/getBestRoute`,
                    {
                      method: 'POST',
                      headers: {
                        // "Access-Control-Allow-Origin": *,
                        mode: 'cors', // no-cors, *cors, same-origin
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        workDay: 0,//workdayHere
                        idToken: token.token}),
                        timeOffset: 15, // time offset with minutes
                    }
                  )*/
                  getBestRoutes()
                }
              }}
            >
              <View
                style={[
                  styles.workTripButton,
                  {
                    flex: 3,
                    backgroundColor: workTripEmpty
                      ? color.malachiteGreen
                      : color.middleBlue,
                    maxWidth: 230,
                  },
                ]}
              >
                <View
                  style={[
                    styles.workTripInfoBottomRow,
                    {alignItems: 'center', borderRadius: 10},
                  ]}
                >
                  <Text style={{marginRight: 20}}>
                    {user.travelPreference == 'driver' ? 'Add work trip' : 'Search trip'}
                  </Text>
                  <FontAwesome5 name="edit" size={20} color={color.primary} />
                </View>
              </View>
            </TouchableCmp>
          </View>
          }
        </View>
      </View>
      <View style={[styles.workTripInfoBottomRow, {}]}>
        <TouchableCmp onPress={() => props.onCancel()}>
          <View
            style={[
              styles.workTripButton,
              {flex: 1, backgroundColor: color.radicalRed},
            ]}
          >
            <Text>Cancel</Text>
          </View>
        </TouchableCmp>

      </View>
    </View>
  )
}

//save button commented
/*        <TouchableCmp
          onPress={async () => {
            await updateUser(user)
            props.onCancel()
          }}
        >
          <View
            style={[
              styles.workTripButton,
              {flex: 3, backgroundColor: color.malachiteGreen},
            ]}
          >
            <Text style={{color: workTripEmpty ? color.greyText : 'black'}}>
              Save
            </Text>
          </View>
        </TouchableCmp> */
export default MyRidesWorkDayEditDialog

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 65,
  },
  workTripInfoContainer: {
    flex: 3,
    width: Dimensions.get('window').width * 0.85,
    height: 120,
    flexDirection: 'column',
  },
  workTripInfoTopRow: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    alignItems: 'center',
  },
})
