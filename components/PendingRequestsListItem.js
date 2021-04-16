import React from 'react'
import {StyleSheet} from 'react-native'
import {
  Content,
  Card,
  CardItem,
  Text,
  Left,
  Right,
  Icon,
  Button,
} from 'native-base'

const PendingRequestsListItem = ({singleItem, navigation}) => {
  return (
    <Content>
      <Card style={styles.list}>
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="person-outline" />
            <Text style={styles.title}>{singleItem.name}</Text>
            <Button onPress={() => navigation.navigate('DriverAcceptRefuse')}>
              <Text style={styles.text}>Accept</Text>
            </Button>
          </Left>
          <Right>
            <Text style={styles.title}>{singleItem.distance}km</Text>
          </Right>
        </CardItem>
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="location-outline" />
            <Text style={styles.title}>{singleItem.address}</Text>
          </Left>
        </CardItem>
      </Card>
    </Content>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'open-sans-semi-bold',
  },
  title: {
    fontFamily: 'open-sans-bold',
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
    borderRadius: 10,
  },
  item: {
    backgroundColor: '#26aae2',
  },
})

export default PendingRequestsListItem
