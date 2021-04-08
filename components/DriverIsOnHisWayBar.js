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
  return (
    <View>
      <Card>
        <CardItem>
          <Left>
            <Text>Your driver is on your way.</Text>
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
  button: {
    backgroundColor: color.primary,
  },
})
