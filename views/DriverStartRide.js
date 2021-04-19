import React, {useContext, useState, useEffect} from 'react'
import {StyleSheet, View, Text, Dimensions} from 'react-native'
// import {
//   Content,
//   Card,
//   CardItem,
//   Body,
//   Container,
//   View,
//   Text,
//   Icon,
//   Button,
// } from 'native-base'
import {Icon, Button} from 'native-base'
import {StopList} from '../components/StopList'
import {UserContext} from '../contexts'
import {updateWorkTrip} from '../controllers/workTripController'
import {getUser} from '../controllers/userController'
import {color} from '../constants/colors'
import * as Location from 'expo-location'

export const DriverStartRide = ({navigation, route}) => {
  let workTrip = route.params.workTrip

  const {user} = useContext(UserContext)

  // const [isDriving, setIsDriving] = useState(workTrip.isDriving)

  const startDriving = async () => {
    let workTripToUpdate = workTrip

    workTripToUpdate.isDriving = !workTrip.isDriving

    // setIsDriving(workTripToUpdate.isDriving)
    await updateWorkTrip(user.company.id, workTripToUpdate)

    if (workTripToUpdate.isDriving) {
      navigation.navigate('DriverOnRoute', {
        workTrip: workTrip,
      })
    }

    // let userIds = workTripToUpdate.scheduledDrive.stops.map(
    //   (item) => item.userID
    // )

    // userIds = userIds.filter((item) => item !== user.id)

    // for (const userId of userIds) {
    //   const notifyUser = await getUser(userId)

    //   await fetch('https://exp.host/--/api/v2/push/send', {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Accept-Encoding': 'gzip, deflate',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       to: notifyUser.ownerPushToken,
    //       title: `Driver has started his ride to ${workTripToUpdate.goingTo}.`,
    //       body: `${workTripToUpdate.driverName} is coming to pick you up.`,
    //     }),
    //   })
    // }
  }

  useEffect(() => {
    ;(async () => {
      let {status} = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        return
      }
    })()
  }, [])

  const drivingTime = () => {
    let totalTime = 0
    workTrip.route.routes[0].legs.map((leg) => {
      totalTime += leg.duration.value
    })
    return parseFloat((totalTime / 60).toFixed(0))
  }
  return (
    <View style={styles.view}>
      <View style={styles.iconView}>
        <View style={styles.iconViewBody}>
          <Icon style={styles.icon} active name="car-outline" />
          <Text style={styles.iconText}>Your next ride</Text>
          <Text style={styles.drivingTime}>
            Driving time: {workTrip.route && drivingTime()} mins
          </Text>
          <Button
            large
            style={styles.button}
            // style={{
            //   ...styles.button,
            //   backgroundColor: isDriving
            //     ? color.radicalRed
            //     : color.malachiteGreen,
            // }}
            onPress={startDriving}
          >
            <Text style={styles.btntxt}>Stop Driving</Text>
            {/* <Text style={styles.btntxt}>
              {isDriving ? 'Stop Driving' : 'Start Driving'}
            </Text> */}
          </Button>
        </View>
      </View>

      <View style={styles.listView}>
        <StopList
          dataArray={workTrip.scheduledDrive.stops}
          route={workTrip.route}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  iconView: {
    flex: 2,
    backgroundColor: 'white',
  },
  iconViewBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 150,
    color: color.darkBlue,
  },
  iconText: {
    fontFamily: 'open-sans-regular',
    fontSize: 26,
  },
  drivingTime: {
    marginTop: 20,
    fontSize: 16,
  },
  listView: {
    flex: Dimensions.get('window').height > 600 ? 2.5 : 1,
  },
  button: {
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    backgroundColor: color.malachiteGreen,
    alignSelf: 'center',
  },
  btntxt: {
    fontSize: 24,
    color: color.lightBlack,
  },
})
