import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {rides} from '../sample_data/ride'

export class RidesView extends Component {
  ridesList = rides.map((ride) => )

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
        {this.ridesList}
      </View>
    )
  }
}

const styles = StyleSheet.create({})
