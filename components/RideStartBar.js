import {Button, Left, Right, View, Content, Card, CardItem, Text} from 'native-base';
import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {StyleSheet} from 'react-native'
import {CompanyListItem} from '../components/CompanyListItem'
import moment from 'moment'

export const RideStartBar = ({driverTrips, navigation}) => {

  const [showStart, setShowStart] = useState(false)
  const [startingRide, setStartingRide] = useState([])
  const [date, setDate] = useState('')
  const [driveStartTime, setDriveStartTime] = useState('7:45')

  const compareTripDates = () => {
    setDate(new Date())
    console.log(date)
    console.log('Ride Start bar')

    for (let i = 0; i < driverTrips.length; i++) {
      const element = driverTrips[i];

      console.log(element.scheduledDrive.start)
      console.log(element.scheduledDrive.end)
      if(moment(date).isBetween(
        element.scheduledDrive.start,
        element.scheduledDrive.end
      )) {
        console.log('is between')
        setStartingRide(element)
        setShowStart(true)
        break
      } else {
        console.log('not between')
        setShowStart(false)
      }
    }
  }


  useEffect(() => {
    compareTripDates()
  }, [])
  return (
    <View>
        <Card>
          <CardItem>
            <Left>
              {showStart ? (
                <Text>You can start your next ride</Text>
              ) : (
                <Text>Your next ride is at</Text>
              )}
            </Left>
            <Right>
              {showStart ? (
                <Button onPress={() => navigation.navigate('DriverStartRide', {startingRide})}><Text>Start</Text></Button>
              ) : (
                <Text>{driveStartTime}</Text>
              )
              }
            </Right>
          </CardItem>
        </Card>
    </View>

  )
}

const styles = StyleSheet.create({

})
