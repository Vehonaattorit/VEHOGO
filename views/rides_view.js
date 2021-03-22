import {Card, CardItem, Row} from 'native-base'
import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {rides} from '../sample_data/ride'
import RideCard from './ride_card'

export class RidesView extends Component {
  ridesList = rides.map((ride) => <RideCard key={ride.key} ride={ride} />)

  render() {
    return (
      <View style={styles.baseView}>
        <Text style={{textAlign: 'left', fontSize: 30, color: 'white'}}>
          Next available rides
        </Text>
        <Text style={{textAlign: 'left', fontSize: 24, color: 'white'}}>
          Friday:
        </Text>
        <View
          style={{
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            marginBottom: 25,
            marginTop: 10
          }}
        />
        {this.ridesList}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  baseView: {
    padding: 20,
    display: 'flex',
    flex: 1,
    backgroundColor: '#2d2d2d',
    justifyContent: 'flex-start',
  },
  userCard: {
    backgroundColor: '#26AAE2',
    alignSelf: 'stretch',
  },
})
