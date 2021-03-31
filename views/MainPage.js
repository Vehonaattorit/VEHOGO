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
import 'firebase/firestore'
import {
  getWorkTrips,
  updateWorkTrip,
  workTripMultiQuery,
  workTripOrderByQuery,
} from '../controllers/workTripController'

import PassengerList from './PassengerList'
import moment from 'moment'
import MenuDrawer from 'react-native-side-drawer'
import {TouchableOpacity} from 'react-native'
import {color} from '../constants/colors'

import Slider from '@react-native-community/slider'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import {useWorkTripHooks} from '../hooks/useHooks'

export const MainPage = ({navigation}) => {
  const {user} = useContext(UserContext)

  const {
    multiSliderValue,
    multiSliderValuesChange,
    queryWithTime,
    fetchTodayRides,
    timeValues,
    open,
    setOpen,
    passengerList,
    extraDay,
  } = useWorkTripHooks(user)

  console.log('passengerList', passengerList)

  useEffect(() => {
    checkTravelPreference()
    // createAsManyWorkTripDocuments()
    fetchTodayRides()
  }, [travelPreference])

  const [travelPreference, setTravelPreference] = useState('')

  // const [passengerList, setPassengerList] = useState(null)

  // const [extraDay, setExtraDay] = useState([])

  const fetchHomeOrWorkTrips = () => {
    const now = new Date(1970, 0, 1, 19, 0)

    const workDayEnd = user.preferedWorkingHours[0].workDayEnd.toDate()

    let goingTo
    if (moment(now).isBetween(new Date(1970, 0, 1, 0, 0), workDayEnd)) {
      goingTo = 'work'
    } else if (moment(now).isBetween(workDayEnd, new Date(1970, 0, 1, 19, 0))) {
      goingTo = 'home'
    } else {
      goingTo = 'work'

      setExtraDay('1')
    }

    return goingTo
  }

  // const fetchTodayRides = async () => {
  //   const currentWeekDay = new Date().getDay()

  //   const goingTo = fetchHomeOrWorkTrips()

  //   const query = await workTripOrderByQuery(user.company[0].id, [
  //     {field: 'workDayNum', condition: '==', value: currentWeekDay},
  //     {field: 'goingTo', condition: '==', value: goingTo},
  //   ])

  //   setPassengerList(query)
  // }

  const checkTravelPreference = async () => {
    setTravelPreference(user.travelPreference)
  }

  const displayPassengerList = () => {
    if (travelPreference === 'passenger') {
      return (
        <Container>
          <Header>
            <Right>
              <Button
                onPress={() => {
                  console.log('Open it')
                  setOpen(!open)
                }}
                transparent
              >
                <Icon name="filter" />
              </Button>
            </Right>
          </Header>
          <View style={styles.listView}>
            <PassengerList
              extraDay={extraDay}
              navigation={navigation}
              dataArray={passengerList}
            />
          </View>
        </Container>
      )
    }
  }

  const drawerContent = () => {
    return (
      <View style={styles.animatedBox}>
        <Text>Start time </Text>
        <Text>Min - Max </Text>
        <MultiSlider
          values={[multiSliderValue[0], multiSliderValue[1]]}
          sliderLength={250}
          onValuesChange={multiSliderValuesChange}
          min={0}
          max={2879}
          step={1}
          allowOverlap
          snapped
        />
        {/* <Text>{`${slideTime().startTime} - ${slideTime().endTime}`}</Text> */}
        <Text>{`${timeValues[0].hours}:${timeValues[0].minutes} - ${timeValues[1].hours}:${timeValues[1].minutes}`}</Text>

        <View style={{flexDirection: 'row'}}>
          <View style={{marginVertical: 10, marginRight: 10}}>
            <Button onPress={queryWithTime}>
              <Text>Submit</Text>
            </Button>
          </View>
          <View style={{marginVertical: 10, marginRight: 10}}>
            <Button
              style={{backgroundColor: 'firebrick'}}
              onPress={() => {
                setOpen(!open)
              }}
            >
              <Text>Cancel</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }

  return (
    <>
      <View style={styles.view}>
        <MenuDrawer
          open={open}
          drawerContent={drawerContent()}
          drawerPercentage={60}
          animationTime={250}
          overlay={true}
          opacity={1}
          position="right"
        >
          {displayPassengerList()}
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
        </MenuDrawer>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  animatedBox: {
    flex: 1,
    backgroundColor: color.secondary,
    zIndex: 999,
    padding: 10,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F04812',
  },
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
})
