import React, {useEffect, useContext, useState} from 'react'
import {StyleSheet} from 'react-native'
import {
  Body,
  View,
  Header,
  Left,
  Text,
  Icon,
  Button,
  Container,
  Title,
  Right,
} from 'native-base'
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
import {
  getWorkTrips,
  updateWorkTrip,
  workTripQuery,
} from '../controllers/workTripController'

import {WorkTrip} from '../models/workTrip'
import {ScheduledDrive} from '../models/scheduleDrive'
import {Stop} from '../models/stop'
import {Car} from '../models/car'
import PassengerListItem from './PassengerListItem'
import PassengerList from './PassengerList'
import {RideStartBar} from '../components/RideStartBar'
import DriverTripList from '../components/DriverTripList'
// import {User} from '../models/user'

export const MainPage = ({navigation}) => {
  const {user} = useContext(UserContext)

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

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: 'none',
  //   })
  // }, [navigation])

  useEffect(() => {
    checkTravelPreference()
    // createAsManyWorkTripDocuments()
    fetchDriverTrips()
    fetchNextDay()

  }, [travelPreference])

  const [travelPreference, setTravelPreference] = useState('')

  const [passengerList, setPassengerList] = useState([])
  const [driverTrips, setDriverTrips] = useState([])

  const fetchNextDay = async () => {
    console.log('travelPreference', travelPreference)

    const result = await getWorkTrips(user.company[0].id)

    const currentDay = new Date().getDay()

    // const query = await workTripQuery(
    //   user.company[0].id,
    //   'scheduledDrive.start',
    //   '<',
    //   new Date(1970, 0, 1, 9, 0)
    // )
    const query = await workTripQuery(
      user.company[0].id,
      'workDayNum',
      '==',
      currentDay
    )

    //console.log('query', query)

    setPassengerList(query)
  }

  const fetchDriverTrips = async () => {
    console.log(user.id)
    const result = await workTripQuery(
      user.company[0].id,
      'driverID',
      '==',
      user.id
    )
    console.log(result)
    setDriverTrips(result)
  }


  const checkTravelPreference = async () => {
    setTravelPreference(user.travelPreference)
    console.log('travelPreference: '+ user.travelPreference)
    // console.log('travelPreference', travelPreference)

    // const result = await getWorkTrips(user.company[0].id)

    // const currentDay = new Date().getDay()

    // // const query = await workTripQuery(
    // //   user.company[0].id,
    // //   'scheduledDrive.start',
    // //   '<',
    // //   new Date(1970, 0, 1, 9, 0)
    // // )
    // const query = await workTripQuery(
    //   user.company[0].id,
    //   'workDayNum',
    //   '==',
    //   currentDay
    // )

    // console.log('query', query)

    // setPassengerList(query)
  }

  const displayPassengerList = () => {
    if (travelPreference === 'passenger') {
      return (
        // <Container>
        //   <Header>
        //     <Left>
        //       <Button transparent>
        //         <Icon name="arrow-back" />
        //       </Button>
        //     </Left>
        //     <Body>
        //       <Title>Header</Title>
        //     </Body>
        //     <Right>
        //       <Button
        //         onPress={() => {
        //           console.log('Sort & Order')
        //         }}
        //         transparent
        //       >
        //         <Icon name="menu" />
        //       </Button>
        //     </Right>
        //   </Header>
        <View style={styles.listView}>
          <PassengerList navigation={navigation} dataArray={passengerList} />
        </View>
      )
    }
  }

  const displayDriverTripList = () => {
    return (
    <View style={styles.driverTripList}>
      <RideStartBar driverTrips={driverTrips} navigation={navigation}/>
      <DriverTripList driverTrips={driverTrips} navigation={navigation}></DriverTripList>
    </View>
    )
  }

  return (
    <View style={styles.view}>


      {travelPreference === 'driver' ? (
        displayDriverTripList()

      ) : (
        displayPassengerList()
      )
      }

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
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },

  listView: {},

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

  driverTripList: {
    flex: 1
  }
})
