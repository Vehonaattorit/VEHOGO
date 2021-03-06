import React, {useContext, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {UserContext} from '../contexts'
import {CustomTitle} from '../components/CustomTitle'
import {updateUser, getUser} from '../controllers/userController'
import {WorkTrip} from '../models/workTrip'
import {ScheduledDrive} from '../models/scheduleDrive'
import {Stop} from '../models/stop'
import {googleMapsApiKey} from '../secrets/secrets'
import {updateWorkTrip} from '../controllers/workTripController'
import firebase from 'firebase'
import CustomButtonIcon from '../components/CustomIconButton'
import {userConverter} from '../models/user'
import {updateUserCarToWorkTrips} from '../utils/updateWorkTripCar'
import fire from '../firebase/fire'
import {Platform} from 'react-native'

export const SetUpInit = ({route, navigation}) => {
  const {user} = useContext(UserContext)

  const [alreadySetUp, setAlreadySetUp] = useState(false)

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

      let response
      if (Platform.OS === 'web') {
        response = await fetch(
          `https://cryptic-depths-30021.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${user.homeLocation.latitude},${user.homeLocation.longitude}&destination=${user.company.location.latitude},${user.company.location.longitude}&key=${googleMapsApiKey}`,
          {
            method: 'GET',
            //Request Type
          }
        )
      } else {
        response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${user.homeLocation.latitude},${user.homeLocation.longitude}&destination=${user.company.location.latitude},${user.company.location.longitude}&key=${googleMapsApiKey}`,
          {
            method: 'GET',
            //Request Type
          }
        )
      }

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
      index % 2 === 0
        ? (end = new Date(end.getTime() + totalTime * 1000))
        : (start = new Date(start.getTime() - totalTime * 1000))

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
      userToUpdate.setupIsCompleted = true
      await updateUser(userToUpdate)
      await updateUserCarToWorkTrips(user)
    })
  }

  const finishSetup = async () => {
    if (!alreadySetUp) {
      setAlreadySetUp(true)

      if (!user.setupIsCompleted) {
        let token = await fire.auth().currentUser.getIdTokenResult()
        console.log('token is', token.token)

        if (Platform.OS === 'web') {
          const response = await fetch(
            `https://cryptic-depths-30021.herokuapp.com/https://us-central1-veho-go.cloudfunctions.net/getBestRoutes`,
            {
              method: 'POST',
              headers: {
                // "Access-Control-Allow-Origin": *,
                mode: 'cors', // no-cors, *cors, same-origin
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({idToken: token.token}),
            }
          )
        } else {
          const response = await fetch(
            `https://us-central1-veho-go.cloudfunctions.net/getBestRoutes`,
            {
              method: 'POST',
              headers: {
                // "Access-Control-Allow-Origin": *,
                mode: 'cors', // no-cors, *cors, same-origin
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({idToken: token.token}),
            }
          )
        }
        if (user.travelPreference === 'driver') {
          await setupWorkTripDocs()
        } else {
          let updatedUser = await getUser(user.id)
          updatedUser.setupIsCompleted = true
          await updateUser(updatedUser)
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <CustomTitle title="You are done." />
      <View style={styles.btnContainer}>
        <CustomButtonIcon
          testID="finishSetupBtn"
          disabled={alreadySetUp}
          style={styles.poweredBtnContainer}
          title="Finish setup"
          onPress={finishSetup}
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
