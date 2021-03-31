import React from 'react'
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

export const DriverStartRide = ({navigation, route}) => {
  let data = route.params
  console.log(data.startingRide.scheduledDrive.stops)

  return (
    <View style={styles.view}>
      <View style={styles.iconView}>
        <Body style={styles.iconViewBody}>
          <Icon style={styles.icon} active name="car-outline" />
          <Text style={styles.iconText}>Your Next Ride</Text>
          <Button
            large
            style={styles.button}
            onPress={() => navigation.navigate('DriverOnRoute')}
          >
            <Text style={styles.btntxt}>Start Driving</Text>
          </Button>
          <Text style={styles.iconText}>Your Passengers</Text>
        </Body>
      </View>

      <View style={styles.listView}>
        <StopList dataArray={data.startingRide.scheduledDrive.stops}></StopList>
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
    color: '#26aae2',
  },
  iconText: {
    fontSize: 30,
    flex: 0.75,
  },

  listView: {
    flex: 2.5,
  },

  button: {
    backgroundColor: '#26aae2',
    borderRadius: 15,
    alignSelf: 'center',
    flex: 0.5,
  },
  btntxt: {
    color: 'white',
  },
})
