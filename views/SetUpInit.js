import React, {useContext} from 'react'
import {StyleSheet, Text, View} from 'react-native'

import {UserContext} from '../contexts'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {AntDesign, FontAwesome} from '@expo/vector-icons'
import {updateUser, userDocumentUpdater} from '../controllers/userController'
import {WorkTrip} from '../models/workTrip'
import {ScheduledDrive} from '../models/scheduleDrive'
import {Car} from '../models/car'
import {Stop} from '../models/stop'
import {googleMapsApiKey} from '../secrets/secrets'
import {updateWorkTrip} from '../controllers/workTripController'

import firebase from 'firebase'
import CustomButtonIcon from '../components/CustomIconButton'
import {userConverter} from '../models/user'

export const SetUpInit = ({route}) => {
  const {user} = useContext(UserContext)

  const setupWorkTripDocs = async () => {
    const workTripDocuments = user.preferedWorkingHours.reduce(
      (res, current, index, array) => {
        return res.concat([current, current])
      },
      []
    )

    let userToUpdate = user
    workTripDocuments.forEach(async (item, i) => {
      let preferedWorkHourindex
      // Find the
      for (let i = 0; i < user.preferedWorkingHours.length; i++) {
        const element = user.preferedWorkingHours[i]
        if (element.workDayNum == item.workDayNum) {
          preferedWorkHourindex = i
        }
      }

      let index = i + 1

      let start =
        index % 2 === 0 ? item.workDayEnd.toDate() : item.workDayStart.toDate()

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${user.homeLocation.latitude},${user.homeLocation.longitude}&destination=${user.company.location.latitude},${user.company.location.longitude}&key=${googleMapsApiKey}`,
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

      let end =
        index % 2 === 0
          ? new Date(1970, 0, 1, item.workDayEnd.toDate().getHours(), 0)
          : new Date(1970, 0, 1, item.workDayStart.toDate().getHours(), 0)

      //adding ride time to end time and start depending on the total drive time
      index % 2 === 0 ? end = new Date(end.getTime() + totalTime * 1000) : start = new Date(start.getTime() - totalTime * 1000)

      const goingTo = index % 2 === 0 ? 'home' : 'work'
      let initialStops = [
        new Stop({
          address: user.homeAddress,
          stopName: 'Home',
          userID: user.id,
          location: user.homeLocation,
        }),
        new Stop({
          location: user.company.location,
          address: user.company.address,
          stopName: user.company.name,
          userID: user.id,
        }),
      ]

      let workTripId = await updateWorkTrip(
        user.company.id, // Looks for company ID that user has joined
        new WorkTrip({
          driverName: user.userName,
          driverID: user.id,
          goingTo: goingTo,
          isDriving: false,
          route: data,
          currentLocation: user.homeAddress,
          workDayNum: item.workDayNum,
          scheduledDrive: new ScheduledDrive({
            start: new firebase.firestore.Timestamp.fromDate(start),
            end: new firebase.firestore.Timestamp.fromDate(end),
            availableSeats: 0,
            stops: goingTo == 'work' ? initialStops : initialStops.reverse(),
            nextStop: 1,
          }),
        })
      )

      if (goingTo == 'work') {
        userToUpdate.preferedWorkingHours[
          preferedWorkHourindex
        ].toWorkRefID = workTripId
      } else {
        userToUpdate.preferedWorkingHours[
          preferedWorkHourindex
        ].toHomeRefID = workTripId
      }
      await updateUser(userToUpdate)
    })
  }

  const finishSetup = async () => {
    if (!user.setupIsCompleted) {
      user.setupIsCompleted = true
      await updateUser(user)

      if (user.travelPreference === 'driver') await setupWorkTripDocs()
    }
  }

  return (
    <View style={styles.container}>
      <CustomTitle title="You are done." />
      <View style={styles.btnContainer}>
        <CustomButtonIcon
          style={styles.poweredBtnContainer}
          title="Finish setup"
          onPress={() => {
            finishSetup()
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 60,
    width: '90%',
    color: 'white',
  },
})
