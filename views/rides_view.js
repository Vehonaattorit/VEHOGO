import {Card, CardItem} from 'native-base'
import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {rides} from '../sample_data/ride'

export class RidesView extends Component {
  ridesList = rides.map((ride) => (
    <Card key={ride.key} style={styles.userCard}>
      <CardItem>
        <View >
          <Text>{ride.name}</Text>
        </View>
      </CardItem>
    </Card>
  ))

  render() {
    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {this.ridesList}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  userCard: {
    alignSelf: 'stretch'
  },
})
