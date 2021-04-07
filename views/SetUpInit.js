import React, {useContext} from 'react'
import {StyleSheet, Text, View} from 'react-native'

import {UserContext} from '../contexts'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {AntDesign, FontAwesome} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'
import {WorkTrip} from '../models/workTrip'
import {ScheduledDrive} from '../models/scheduleDrive'
import {Car} from '../models/car'
import {Stop} from '../models/stop'
import {googleMapsApiKey} from '../secrets/secrets'
import {updateWorkTrip} from '../controllers/workTripController'

import firebase from 'firebase'

export const SetUpInit = ({route}) => {
  const {user} = useContext(UserContext)

  console.log('user company id', user.company.id)
  console.log('user SetUpInit', user)

  const setupWorkTripDocs = async () => {
    const workTripDocuments = user.preferedWorkingHours.reduce(
      (res, current, index, array) => {
        return res.concat([current, current])
      },
      []
    )

    // console.log('workTripDocuments', workTripDocuments)

    workTripDocuments.forEach(async (item, i) => {
      let index = i + 1

      console.log('WHOLE ITEM', item)
      console.log('item workDayStart', item.workDayStart.toDate())
      console.log('item workDayEnd', item.workDayEnd.toDate())

      const start =
        index % 2 === 0 ? item.workDayEnd.toDate() : item.workDayStart.toDate()

      // TODO:
      // Implement how long it takes driver to back home instead of
      //  "item.workDayEnd.toDate().getHours() + 1, 30)" placeholders
      console.log('fetch call',`https://maps.googleapis.com/maps/api/directions/json?origin=${user.homeLocation.latitude},${user.homeLocation.longitude}&destination=${user.company.latitude},${user.company.longitude}&key=${googleMapsApiKey}`)
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
      data.routes[0].legs.map((leg) => {totalTime += leg.duration.value})
      totalTime = parseFloat((totalTime / 60).toFixed(0))

      const end =
        index % 2 === 0
          ? new Date(1970, 0, 1, item.workDayEnd.toDate().getHours(), item.workDayEnd.toDate().setMinutes(item.workDayEnd.toDate().getMinutes() + totalTime))
          : new Date(1970, 0, 1, item.workDayStart.toDate().getHours(), item.workDayEnd.toDate().setMinutes(item.workDayEnd.toDate().getMinutes() + totalTime))

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

      console.log('user.company.id', user.company.id)

      console.log()

      await updateWorkTrip(
        user.company.id, // Looks for company ID that user has joined
        new WorkTrip({
          driverID: user.id,
          goingTo: goingTo,
          isDriving: false,
          route: data,
          currentLocation: user.homeAddress,
          workDayNum: item.workDayNum,
          scheduledDrive: new ScheduledDrive({
            start: new firebase.firestore.Timestamp.fromDate(start),
            end: new firebase.firestore.Timestamp.fromDate(end),
            takenSeats: 0,
            stops: goingTo == 'work' ? initialStops : initialStops.reverse(),
          }),
          car: new Car({
            id: 'dashfihasi',
            driverName: user.userName,
            registerNumber: 'KIR-180',
            vehicleDescription: 'Musta sedan',
            availableSeats: 3,
          }),
        })
      )
    })
  }

  const finishSetup = () => {
    if (!user.setupIsCompleted) {
      console.log('Setup is completed')
      user.setupIsCompleted = true
      updateUser(user)

      if (user.travelPreference === 'driver') setupWorkTripDocs()
    }
  }

  return (
    <View style={styles.container}>
      <CustomTitle title="You are done." />
      <View style={styles.icon}>
        {Platform.OS === 'ios' ? (
          <AntDesign name="user" size={300} color={color.secondaryDark} />
        ) : (
          <FontAwesome name="user" size={300} color={color.secondaryDark} />
        )}
      </View>
      <View style={styles.inputContainer}>
        <CustomButton
          style={styles.btns}
          title="Finish setup"
          onPress={() => {
            finishSetup()
            // navigation.navigate('Address')
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
  inputContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 60,
    width: '90%',
    color: 'white',
  },
})
