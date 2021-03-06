import {
  Button,
  Left,
  Right,
  View,
  Content,
  Card,
  CardItem,
  Text,
} from 'native-base'
import React, {useState, useEffect} from 'react'
import {StyleSheet} from 'react-native'
import moment from 'moment'
import {
  workTripMultiQueryStream,
} from '../controllers/workTripController'
import {color} from '../constants/colors'

export const RideStartBar = ({user, navigation, driverTrips}) => {
  const [showStart, setShowStart] = useState(false)
  const [startingRide, setStartingRide] = useState([])
  const [date, setDate] = useState('')
  const [driveStartTime, setDriveStartTime] = useState(null)
  let nextDayTrips = []


  function inTime(start, end) {
    var now = new Date()
    //some problems with times. If destination is close to start, end date smaller than start
    var time = now.getHours() * 60 + now.getMinutes()
    console.log('current',time)
    console.log('start',start)
    console.log('end',end)
    return time >= start && time < end
  }

  const checkButtonVisible = (startDate, endDate) => {
    var start =
      startDate.toDate().getHours() * 60 + startDate.toDate().getMinutes() - 30
    var end = endDate.toDate().getHours() * 60 + endDate.toDate().getMinutes() + 10

    if (inTime(start, end) == true) {
      console.log('setting true')
      setShowStart(true)
    } else {
      console.log('setting false')
      setShowStart(false)
    }
  }

  useEffect(() => {
    const getNextRide = async () => {
      const now = new Date()

      const currentWeekDay = now.getDay() == 0 ? 7 : now.getDay()
      console.log('currentWeekday', currentWeekDay)
      const currentHours = now.getHours()
      const minutes = now.getMinutes()

      let tomorrowWeekDay

      for (let i = 0; i < 7; i++) {
        if (user.preferedWorkingHours[i] != undefined) {
          const preferedWorkingHours = user.preferedWorkingHours[i]

          if (currentWeekDay <= preferedWorkingHours.workDayNum) {
            if (currentWeekDay < user.preferedWorkingHours[i].workDayNum) {
              tomorrowWeekDay = user.preferedWorkingHours[i].workDayNum
              break
            } else {
              tomorrowWeekDay = user.preferedWorkingHours[0].workDayNum
            }
          } else {
            tomorrowWeekDay = user.preferedWorkingHours[0].workDayNum
          }
        }
      }
      console.log('next day', tomorrowWeekDay)
      /*const nextDayTrips = await workTripMultiQuery(user.company.id, [
        {
          field: 'workDayNum',
          condition: '==',
          value: tomorrowWeekDay,
        },
        {
          field: 'driverID',
          condition: '==',
          value: user.id,
        },
      ])*/

      try {
        //var trips = []
        const ref = await workTripMultiQueryStream(user.company.id, [
          {field: 'workDayNum', condition: '==', value: tomorrowWeekDay, },
          {field: 'driverID', condition: '==', value: user.id, },
        ])

        ref.onSnapshot((querySnapshot) => {
          nextDayTrips = []
          querySnapshot.forEach((doc) => {
            nextDayTrips.push(doc.data())
          })
          console.log('length of next day trips', nextDayTrips.length)


          if (nextDayTrips.length != 0) {
            console.log('trips length', nextDayTrips.length)
            let found = false
            let nextWorkTrip
            for (let i = 0; i < user.preferedWorkingHours.length; i++) {
              const preferedHours = user.preferedWorkingHours[i]
              if (preferedHours.workDayNum == currentWeekDay) {
                found = true
                break
              }
            }

            console.log('found')

            if (found) {
              // sorting the morning ride to start
              // 17.04.2021 replaced todayWorkTrips with driverTrips
              if (driverTrips[0].goingTo == 'home') driverTrips.reverse()

              for (let i = 0; i < driverTrips.length; i++) {
                const workTrip = driverTrips[i]
                const nowInMinutes = currentHours * 60 + minutes
                let startTime = workTrip.scheduledDrive.start.toDate()
                const workTripStartInMinutes =
                  startTime.getHours() * 60 + startTime.getMinutes()
                //now is before workTrip start
                if (nowInMinutes < workTripStartInMinutes) {
                  //this workTrip is next, display it on the screen
                  setDriveStartTime(workTrip.scheduledDrive.start)
                  setStartingRide(workTrip)
                  checkButtonVisible(
                    workTrip.scheduledDrive.start,
                    workTrip.scheduledDrive.end
                  )
                  return
                }
              }
              if (driveStartTime == null) {
                // next workday morning workTrip is next and displayed on the screen
                if (nextDayTrips[0].goingTo == 'home') nextDayTrips.reverse()
                setDriveStartTime(nextDayTrips[0].scheduledDrive.start)
                setStartingRide(nextDayTrips[0])
                checkButtonVisible(
                  nextDayTrips[0].scheduledDrive.start,
                  nextDayTrips[0].scheduledDrive.end
                )
                return
              }
            } else {
              if (nextDayTrips[0].goingTo == 'home') nextDayTrips.reverse()
              setDriveStartTime(nextDayTrips[0].scheduledDrive.start)
              setStartingRide(nextDayTrips[0])
              checkButtonVisible(
                nextDayTrips[0].scheduledDrive.start,
                nextDayTrips[0].scheduledDrive.end
              )
              return
            }
          }
        })
      } catch (e) {
        console.log('stream failed', e)
      }
    }
    if (driverTrips != undefined && driverTrips.length > 0) {
      console.log('inside get next ride if')
      console.log('driver Trips', driverTrips)
      getNextRide()
    }
  }, [driverTrips])

  return (
    <View>
      <Card>
        <CardItem>
          <Left>
            {showStart ? (
              <Text style={styles.text}>You can start your next ride</Text>
            ) : (
              <Text style={styles.text}>Your next ride is at</Text>
            )}
          </Left>
          <Right>
            {driverTrips.length > 0 ? (
              <>
                {true ? (
                  <Button
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('DriverStartRide', {
                        workTrip: startingRide,
                      })
                    }
                  >
                    <Text style={styles.starText}>
                      Start{' '}
                      {driveStartTime &&
                        moment(driveStartTime.toDate()).format('HH:mm')}
                    </Text>
                  </Button>
                ) : (
                  <Text style={styles.text}>
                    {driveStartTime &&
                      moment(driveStartTime.toDate()).format('HH:mm')}
                  </Text>
                )}
              </>
            ) : (
              <Text>No trips today</Text>
            )}
          </Right>
        </CardItem>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: color.lightBlack,
    fontFamily: 'open-sans-semi-bold',
  },

  button: {
    backgroundColor: color.darkBlue,
  },
})

export default RideStartBar
