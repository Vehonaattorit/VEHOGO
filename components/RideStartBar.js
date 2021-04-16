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
  useDriverTripListHook,
  workTripMultiQuery,
  workTripOrderByQuery,
} from '../controllers/workTripController'
import {color} from '../constants/colors'
import {getUser} from '../controllers/userController'

export const RideStartBar = ({user, navigation}) => {
  const [showStart, setShowStart] = useState(false)
  const [startingRide, setStartingRide] = useState([])
  const [date, setDate] = useState('')
  const [driveStartTime, setDriveStartTime] = useState(null)

  // CURRENTWEEKDAY
  const [currentWeekDay, setCurrentWeekDay] = useState(5)

  const {driverTrips, isLoading} = useDriverTripListHook(user, [
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

  // console.log('DriverTrips', driverTrips[0].id)

  const getNextRide = async () => {
    const now = new Date()
    // 13.04. 10:47 BACKUP
    // const now = new Date()
    // END
    // 13.04. 10:47 BACKUP
    // const currentWeekDay = now.getDay()
    // END

    // MUISTA POISTAA !!!
    const currentWeekDay = 5
    setCurrentWeekDay(currentWeekDay)

    // const now = new Date(1970, 0, 2, 6, 30)
    // MUISTA LISÄTÄ !!!
    // const currentWeekDay = now.getDay()
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
    // BACKUP 17.04.2021 Trying out useDriverTripListHook in workTripController.js
    // const todayWorkTrips = await workTripMultiQuery(user.company.id, [
    //   {
    //     field: 'workDayNum',
    //     condition: '==',
    //     value: currentWeekDay,
    //   },
    //   {
    //     field: 'driverID',
    //     condition: '==',
    //     value: user.id,
    //   },
    // ])
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

    var time = now.getHours() * 60 + now.getMinutes()

    return time >= start && time < end
  }

  const checkButtonVisible = (startDate, endDate) => {
    var start =
      startDate.toDate().getHours() * 60 + startDate.toDate().getMinutes() - 10
    var end = endDate.toDate().getHours() * 60 + endDate.toDate().getMinutes()

    if (inTime(start, end) == true) {
      setShowStart(true)
    } else {
      setShowStart(false)
    }
  }

  useEffect(() => {
    if (!isLoading) getNextRide()
  }, [driverTrips, isLoading])

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
            {!showStart ? (
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
