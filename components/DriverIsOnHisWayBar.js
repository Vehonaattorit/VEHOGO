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
import React, {useEffect} from 'react'
import {color} from '../constants/colors'

const DriverIsOnHisWayBar = ({navigation, activeRide}) => {
  const checkVariable = (variable) => {
    if (Array.isArray(variable)) {
      return true
    } else {
      return false
    }
  }

  const workTrip = activeRide

  useEffect(() => {}, [activeRide])

  return (
    <View>
      <Card>
        <CardItem>
          <Left>
            {checkVariable(activeRide) ? (
              <Text style={styles.text}>
                {activeRide.length} drivers are on their way.
              </Text>
            ) : (
              <Text style={styles.text}>
                Your driver {activeRide.driverName} is on its way.
              </Text>
            )}
          </Left>
          <Right>
            {checkVariable(activeRide) ? (
              <Button
                style={styles.button}
                onPress={() =>
                  navigation.navigate('ActiveRidesList', {
                    workTrip,
                  })
                }
              >
                <Text>Show</Text>
              </Button>
            ) : (
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
            )}
          </Right>
        </CardItem>
      </Card>
    </View>
  )
}

export default DriverIsOnHisWayBar

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
