import React from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon, Button} from 'native-base'
import moment from 'moment'

import {checkWhatDayItIs} from '../utils/utils'

const DriverTripListItem = ({singleTrip, navigation}) => {
  return (
    <Content>
      <Card style={styles.list} >
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="location-outline" />
            <Text style={styles.title}>{singleTrip.goingTo}</Text>
          </Left>
          <Right>
            <Text style={styles.title}>Stops: {singleTrip.scheduledDrive.stops.length}</Text>
          </Right>
        </CardItem>
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="time-outline" />
            <Text style={styles.title}>
              {moment(singleTrip.scheduledDrive.start.toDate()).format('HH:mm') +
                ' - ' +
                moment(singleTrip.scheduledDrive.end.toDate()).format('HH:mm')}
            </Text>
          </Left>
        </CardItem>
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="time-outline" />
            <Text style={styles.title}>
            {checkWhatDayItIs(singleTrip.workDayNum)}
            </Text>
          </Left>
        </CardItem>
      </Card>
    </Content>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  list: {
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#26aae2',
    borderRadius: 20,
  },
  item: {
    backgroundColor: '#26aae2',
  },
})

export default DriverTripListItem
