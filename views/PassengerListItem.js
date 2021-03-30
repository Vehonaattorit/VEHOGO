import React from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon} from 'native-base'

import {TouchableOpacity} from 'react-native'

const PassengerListItem = ({navigation, singleItem}) => {
  const {car} = singleItem

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
              <Text style={styles.title}>{car.driverName}</Text>
            </Left>
            <Right>
              <Text style={styles.title}>{singleItem.distance}20 km</Text>
            </Right>
          </CardItem>
          <CardItem style={styles.item}>
            <Left>
              <Icon active name="location-outline" />
              <Text style={styles.title}>
                {/* {singleItem.address}Espoon keskus */}
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
