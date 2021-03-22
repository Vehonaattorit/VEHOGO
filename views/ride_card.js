import {Card} from 'native-base'
import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import Capitalize from '../functions/capitalize'
import {rides} from '../sample_data/ride'

const RideCard = (props) => {
  return (
    <Card key={props.ride.key} style={styles.userCard}>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <View
          style={{
            width: 100,
            backgroundColor: '#007BB0',
            paddingHorizontal: 5,
            paddingVertical: 25,
          }}
        >
          <Text style={{color: 'white', fontSize: 28}}>
            {Capitalize(props.ride.destination)}
          </Text>
        </View>
        <View style={{flexDirection: 'column', flex: 1}}>
          <View
            style={{
              flex: 1,
              paddingLeft: 30,
              paddingTop: 5,
              flexDirection: 'row',
              display: 'flex',
            }}
          >
            <Text style={{flex: 2, color: 'white', fontSize: 24}}>
              {Capitalize(props.ride.name)}
            </Text>
            <Text style={{flex: 1, color: 'white', fontSize: 24}}>
              {props.ride.seats}/4
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 2,
              width: 200,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{flex: 1, color: 'white', fontSize: 24, alignSelf: 'center'}}
          >
            {props.ride.arrivalTime}
          </Text>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: '#26AAE2',
    alignSelf: 'stretch',
  },
})

export default RideCard
