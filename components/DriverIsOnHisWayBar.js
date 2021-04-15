import {
  Button,
  Left,
  Right,
  View,
  Content,
  Card,
  CardItem,
  Text,
} from 'native-base'

import {StyleSheet} from 'react-native'
import React from 'react'
import {color} from '../constants/colors'

export default DriverIsOnHisWayBar = ({user, navigation, activeRide}) => {
  const workTrip = activeRide

  // console.log('workTrip', workTrip)

  return (
    <View>
      <Card>
        <CardItem>
          <Left>
            <Text style={styles.text}>Your driver is on its way.</Text>
          </Left>

          <Right>
            <Button
              style={styles.button}
              onPress={() =>
                navigation.navigate('DriverOnRoute', {
                  workTrip,
                })
              }
            >
              <Text>Show</Text>
            </Button>
          </Right>
        </CardItem>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: color.lightBlack,
    fontFamily: 'open-sans-semi-bold',
  },
  startText: {
    fontFamily: 'open-sans-semi-bold',
  },
  button: {
    backgroundColor: color.darkBlue,
  },
})
