import React, {useEffect, useContext, useState} from 'react'
import {SafeAreaView, StyleSheet} from 'react-native'
import {Body, View, Text, Icon, Button} from 'native-base'
import {UserContext} from '../contexts'
import {signOut} from '../controllers/LoginController'
import PendinRequestList from '../components/PendingRequestsList'
import {
  companyStream,
  updateCompany,
  getCompanys,
} from '../controllers/companyController'
import {useDocumentData} from 'react-firebase-hooks/firestore'

import 'firebase/firestore'
import {getWorkTrips, updateWorkTrip} from '../controllers/workTripController'

import {Company} from '../models/company'
import {WorkTrip} from '../models/workTrip'
import {ScheduledDrive} from '../models/scheduleDrive'
import {Stop} from '../models/stop'
import {Car} from '../models/car'
import PassengerListItem from './PassengerListItem'
import PassengerList from './PassengerList'
// import {User} from '../models/user'

export const MainPage = ({navigation}) => {
  const {user} = useContext(UserContext)

  // YOU NEED THIS !
  const createAsManyWorkTripDocuments = () => {
    const workTripDocuments = user.preferedWorkingHours.reduce(
      (res, current, index, array) => {
        return res.concat([current, current])
      },
      []
    )

    console.log('workTripDocuments', workTripDocuments)

    workTripDocuments.forEach((item, i) => {
      let index = i + 1

      const start =
        index % 2 === 0
          ? item.workDayEnd.toDate()
          : new Date(2021, 3, 29, 8, 30)

      const end =
        index % 2 === 0
          ? new Date(2021, 3, 29, 17, 30)
          : item.workDayStart.toDate()
      console.log('INDEKSUS', index)

      updateWorkTrip(
        '515bb500-84b0-424f-8017-e0060f953562',
        new WorkTrip({
          car: 'Jotain',
          currentLocation: 'Jotain',
          scheduledDrive: 'dajioasjodi',
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
              }),
            ],
          }),
          car: new Car({
            id: 'dashfihasi',
            driverName: 'Mental Mickey',
            registerNumber: 'KIR-180',
            vehicleDescription: 'Musta sedan',
            availableSeats: 3,
          }),
        })
      )
    })
  }
  // END

  const signedOut = () => {
    //executed when signin out
  }
  let data = [
    {
      key: 1,
      name: 'Tommi',
      address: 'kaarimäki 3',
      city: 'Vantaa',
      distance: 2,
    },
    {
      key: 2,
      name: 'Michael',
      address: 'Siltakuja 2',
      city: 'Espoo',
      distance: 3,
    },
    {
      key: 3,
      name: 'Maija',
      address: 'esimerkkikuja 6',
      city: 'Espoo',
      distance: 4,
    },
  ]

  const passengerList = [
    {
      id: 0,
      name: 'Michael',
      distance: '20',
      address: 'Junatie 12, Helsinki',
    },
    {
      id: 1,
      name: 'Timo',
      distance: '30',
      address: 'Junatie 12, Helsinki',
    },
    {
      id: 2,
      name: 'Pekka',
      distance: '50',
      address: 'Junatie 12, Helsinki',
    },
  ]

  useEffect(() => {
    checkTravelPreference()
    // createAsManyWorkTripDocuments()
  }, [travelPreference])

  const [travelPreference, setTravelPreference] = useState('')

  const checkTravelPreference = async () => {
    setTravelPreference(user.travelPreference)

    console.log('travelPreference', travelPreference)

    const result = await getWorkTrips('515bb500-84b0-424f-8017-e0060f953562')

    console.log('result', result)
  }

  return (
    <SafeAreaView style={styles.view}>
      {travelPreference === 'passenger' && (
        <View style={styles.listView}>
          <PassengerList dataArray={passengerList} />
        </View>
      )}

      {/* <View style={styles.listView}>
        <PendinRequestList
          dataArray={data}
          navigation={navigation}
        ></PendinRequestList>
      </View>
      <Text>{user.id}</Text> */}
      <View style={styles.scheduleView}>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('OutlookCalendar')}
        >
          <Text>Calender</Text>
        </Button>
        <Button style={styles.button} onPress={() => signOut(signedOut)}>
          <Text>LogOut</Text>
        </Button>

        <Button
          style={styles.button}
          onPress={() => navigation.navigate('DriverStartRide')}
        >
          <Text>Start Ride</Text>
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('DriverCarList')}
        >
          <Text>DriverCarList</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },

  listView: {
    flex: 1,
  },

  scheduleView: {
    flex: 1,
  },

  button: {
    alignSelf: 'center',
    margin: 2,
  },

  titleText: {
    fontSize: 24,
  },
})
