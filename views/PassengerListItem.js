import React from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon} from 'native-base'

import {TouchableOpacity} from 'react-native'
import moment from 'moment'

const PassengerListItem = ({navigation, singleItem}) => {
  const {car, scheduledDrive, goingTo, workDayNum} = singleItem

  const checkWhatDayItIs = (dayNum) => {
    switch (dayNum) {
      case 1:
        return 'Monday'

      case 2:
        return 'Tuesday'

      case 3:
        return 'Wednesday'
      case 4:
        return 'Thursday'

        break
      case 5:
        return 'Friday'

        break
      case 6:
        return 'Saturday'

      case 7:
        return 'Sunday'

      default:
        return 'Monday'
    }
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('RequestRide', {
          singleItem,
        })
      }
    >
      <Content>
        <Card style={styles.list}>
          <CardItem style={styles.item}>
            <Left>
              <Icon active name="person-outline" />
              <Text style={styles.title}>
                {car.driverName} to {goingTo} place{' '}
                {checkWhatDayItIs(workDayNum)}
              </Text>
            </Left>
            <Right>
              <Text style={styles.title}>{singleItem.distance}20 km</Text>
            </Right>
          </CardItem>
          <CardItem style={styles.item}>
            <Left>
              <Icon active name="location-outline" />
              <Text style={styles.title}>
                {scheduledDrive.stops[0].location}
              </Text>
              <Text>
                {moment(scheduledDrive.start).format('HH:mm') +
                  ' - ' +
                  moment(scheduledDrive.end).format('HH:mm')}
              </Text>
            </Left>
          </CardItem>
        </Card>
      </Content>
    </TouchableOpacity>
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

export default PassengerListItem
