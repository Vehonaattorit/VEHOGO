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
import {FlatList} from 'react-native'
import {StyleSheet} from 'react-native'
import {CompanyListItem} from '../components/CompanyListItem'
import moment from 'moment'
import {
  workTripMultiQuery,
  workTripOrderByQuery,
} from '../controllers/workTripController'
import {color} from '../constants/colors'

export const RideStartBar = ({user, navigation}) => {
  const [showStart, setShowStart] = useState(false)
  const [startingRide, setStartingRide] = useState([])
  const [date, setDate] = useState('')
  const [driveStartTime, setDriveStartTime] = useState(null)

  const getNextRide = async () => {
    console.log('fetching')
    const now = new Date()
    const currentWeekDay = now.getDay()
    const currentHours = now.getHours()
    const minutes = now.getMinutes()
    let tomorrowWeekDay

    for (let i = currentWeekDay; i <= user.preferedWorkingHours.length; i++) {
      const preferedWorkingHours = user.preferedWorkingHours[i]
      if (preferedWorkingHours == undefined) {
        tomorrowWeekDay = user.preferedWorkingHours[0].workDayNum
        break
      }
      if (preferedWorkingHours.workDayNum == i + 1) {
        tomorrowWeekDay = preferedWorkingHours.workDayNum
        break
      }
    }

    // query tomorrows workTrips with query
    const todayWorkTrips = await workTripMultiQuery(user.company.id, [
      {
        field: 'workDayNum',
        condition: '==',
        value: currentWeekDay,
      },
      {
        field: 'driverID',
        condition: '==',
        value: user.id,
      },
    ])
    const tomorrowWorkTrips = await workTripMultiQuery(user.company.id, [
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
    ])
    let found = false
    let nextWorkTrip
    for (let i = 0; i < user.preferedWorkingHours.length; i++) {
      const preferedHours = user.preferedWorkingHours[i]
      if (preferedHours.workDayNum == currentWeekDay) {
        found = true
        break
      }
    }

    if (found) {
      // sorting the morning ride to start
      if (todayWorkTrips[0].goingTo == 'home') todayWorkTrips.reverse()

      for (let i = 0; i < todayWorkTrips.length; i++) {
        const workTrip = todayWorkTrips[i]
        const nowInMinutes = currentHours * 60 + minutes
        let startTime = workTrip.scheduledDrive.start.toDate()
        const workTripStartInMinutes =
          startTime.getHours() * 60 + startTime.getMinutes()
        //now is before workTrip start
        if (nowInMinutes < workTripStartInMinutes) {
          console.log('next ride today')
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
        console.log('next workday morning')
        // next workday morning workTrip is next and displayed on the screen
        if (tomorrowWorkTrips[0].goingTo == 'home') tomorrowWorkTrips.reverse()
        setDriveStartTime(tomorrowWorkTrips[0].scheduledDrive.start)
        setStartingRide(tomorrowWorkTrips[0])
        checkButtonVisible(
          tomorrowWorkTrips[0].scheduledDrive.start,
          tomorrowWorkTrips[0].scheduledDrive.end
        )
        return
      }
    } else {
      console.log('next day if today no more rides')
      if (tomorrowWorkTrips[0].goingTo == 'home') tomorrowWorkTrips.reverse()
      setDriveStartTime(tomorrowWorkTrips[0].scheduledDrive.start)
      setStartingRide(tomorrowWorkTrips[0])
      checkButtonVisible(
        tomorrowWorkTrips[0].scheduledDrive.start,
        tomorrowWorkTrips[0].scheduledDrive.end
      )
      return
    }
  }

  function inTime(start, end) {
    var now = new Date()
    console.log(now)
    var time = now.getHours() * 60 + now.getMinutes()
    console.log(time)
    return time >= start && time < end
  }

  const checkButtonVisible = (startDate, endDate) => {
    console.log('checkButton visible')
    var start =
      startDate.toDate().getHours() * 60 + startDate.toDate().getMinutes() - 10
    var end = endDate.toDate().getHours() * 60 + endDate.toDate().getMinutes()
    console.log('times are set')
    if (inTime(start, end) == true) {
      console.log('returned true')
      setShowStart(true)
    } else {
      console.log('returned false')
      setShowStart(false)
    }
    console.log('end of function')
  }

  useEffect(() => {
    getNextRide()
  }, [])

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
            {
              showStart ? (
                <Button
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate('DriverStartRide', {
                      workTrip: startingRide,
                    })
                  }
                >
                  <Text style={styles.starText}>Start {driveStartTime &&
                    moment(driveStartTime.toDate()).format('HH:mm')}</Text>
                </Button>
              ) : (
                <Text style={styles.text}>
                  {driveStartTime &&
                    moment(driveStartTime.toDate()).format('HH:mm')}
                </Text>
              )
            }
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
