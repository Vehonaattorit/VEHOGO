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
import {updateWorkTrip} from '../controllers/workTripController'

export const SetUpInit = ({route}) => {
  const {user} = useContext(UserContext)

  console.log('user company id', user.company[0].id)
  console.log('user SetUpInit', user)

  const setupWorkTripDocs = () => {
    const workTripDocuments = user.preferedWorkingHours.reduce(
      (res, current, index, array) => {
        return res.concat([current, current])
      },
      []
    )

    // console.log('workTripDocuments', workTripDocuments)

    workTripDocuments.forEach((item, i) => {
      let index = i + 1

      console.log('WHOLE ITEM', item)
      console.log('item workDayStart', item.workDayStart)
      console.log('item workDayEnd', item.workDayEnd)

      const start =
        index % 2 === 0 ? item.workDayEnd : new Date(2021, 3, 29, 8, 30)

      const end =
        index % 2 === 0 ? new Date(2021, 3, 29, 17, 30) : item.workDayStart

      const goingTo = index % 2 === 0 ? 'home' : 'work'

      updateWorkTrip(
        user.company[0].id, // Looks for company ID that user has joined
        new WorkTrip({
          driverID: user.id,
          goingTo: goingTo,
          currentLocation: user.homeAddress,
          workDayNum: item.workDayNum,
          scheduledDrive: new ScheduledDrive({
            start: start,
            end: end,
            takenSeats: 3,
            stops: [
              new Stop({
                location: user.city,
                address: user.homeAddress,
                stopName: 'Home',
                userID: user.id,
                latLng: user.latLng,
              }),
            ],
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

      console.log('user.travelPreference', user.travelPreference)

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
