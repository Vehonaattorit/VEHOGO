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
import React from 'react'

export default DriverIsOnHisWayBar = ({user, navigation, activeRide}) => {
  return (
    <View>
      <Card>
        <CardItem>
          <Left>
            <Text>Your driver is on your way.</Text>
          </Left>

          <Right>
            <Button
              onPress={() =>
                navigation.navigate('DriverOnRoute', {
                  activeRide,
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
