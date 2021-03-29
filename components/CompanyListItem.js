import React from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon, Button} from 'native-base'

export const CompanyListItem = ({singleItem, navigation}) => {




  return (
    <Content>
      <Card style={styles.list} >
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="home-outline" />
            <Text style={styles.title}>Company: {singleItem.displayName}</Text>
          </Left>
          <Right>
            <Button><Text>Join</Text></Button>
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
    backgroundColor: 'white',
    borderRadius: 20,
  },
  item: {
    backgroundColor: 'white',
  },
})

export default CompanyListItem
