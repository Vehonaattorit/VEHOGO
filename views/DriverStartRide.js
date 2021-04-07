import React, {useContext, useState} from 'react'
import {SafeAreaView, StyleSheet} from 'react-native'
import {
  Content,
  Card,
  CardItem,
  Body,
  Container,
  View,
  Text,
  Icon,
  Button,
} from 'native-base'
import {StopList} from '../components/StopList'
import {UserContext} from '../contexts'
import {updateWorkTrip} from '../controllers/workTripController'
import {getUser} from '../controllers/userController'
import {color} from '../constants/colors'

export const DriverStartRide = ({navigation, route}) => {
  let workTrip = route.params
  console.log(workTrip.startingRide.scheduledDrive.stops)

  const {user} = useContext(UserContext)

  const {startingRide} = route.params

  const [isDriving, setIsDriving] = useState(startingRide.isDriving)

  const startDriving = async () => {
    let workTripToUpdate = startingRide

    workTripToUpdate.isDriving = !startingRide.isDriving

    setIsDriving(workTripToUpdate.isDriving)
    await updateWorkTrip(user.company.id, workTripToUpdate)

    if (workTripToUpdate.isDriving) {
      navigation.navigate('DriverOnRoute', {
        activeRide: workTripToUpdate,
        workTrip,
      })
    }

    let userIds = workTripToUpdate.scheduledDrive.stops.map(
      (item) => item.userID
    )

    userIds = userIds.filter((item) => item !== user.id)

    for (const userId of userIds) {
      const notifyUser = await getUser(userId)

      console.log('notifyUser', notifyUser)

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: notifyUser.ownerPushToken,
          title: `Driver has started his ride to ${workTripToUpdate.goingTo}.`,
          body: `${workTripToUpdate.car.driverName} is coming to pick you up.`,
        }),
      })
    }
  }

  return (
    <View style={styles.view}>
      <View style={styles.iconView}>
        <Body style={styles.iconViewBody}>
          <Icon style={styles.icon} active name="car-outline" />
          <Text style={styles.iconText}>Your Next Ride</Text>
          <Button
            large
            style={{
              ...styles.button,
              backgroundColor: isDriving ? color.radicalRed : color.primary,
            }}
            onPress={startDriving}
          >
            <Text style={styles.btntxt}>
              {isDriving ? 'Stop Driving' : 'Start Driving'}
            </Text>
          </Button>
          <Text style={styles.iconText}>Your Passengers</Text>
        </Body>
      </View>

      <View style={styles.listView}>
        <StopList dataArray={workTrip.startingRide.scheduledDrive.stops} />
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
    flex: 2.5,
    backgroundColor: 'white',
  },
  iconViewBody: {
    flex: 1,
  },
  icon: {
    fontSize: 200,
    flex: 3,
    color: color.primary,
  },
  iconText: {
    fontSize: 30,
    flex: 0.75,
  },

  listView: {
    flex: 2.5,
  },
  button: {
    borderRadius: 15,
    alignSelf: 'center',
    flex: 0.5,
  },
  btntxt: {
    color: 'white',
  },
})
