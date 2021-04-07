import React, {useEffect, useState} from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon} from 'native-base'
import {getUser} from '../controllers/userController'

const StopListItem = ({singleItem, route, index}) => {

  const [stopUserInfo, setStopUserInfo] = useState([])

  if (index === 0) {

    console.log('first index', index)
  } else {
    console.log('index', index)
    //console.log('leg',index - 1,route.route.routes[0].legs[index - 1]);
  }




  const getStopUserInfo = async () => {
    const user = await getUser(singleItem.userID)
    console.log(user)
    setStopUserInfo(user)
  }
  useEffect(() => {
    getStopUserInfo()
  }, [])

  return (
    <Content>
      <Card style={styles.list}>
        <CardItem style={styles.item}>
          <Icon active name="location-outline" />
          <Text style={styles.title}>
            {singleItem.address}
          </Text>
        </CardItem>
        {index === 0 ? (
          <CardItem style={styles.item}>
            <Left>
              <Icon active name="person-outline" />
              <Text style={styles.title}>{singleItem.stopName}</Text>
            </Left>
            <Right>
              <Text style={styles.title}>Start place</Text>
            </Right>
          </CardItem>
        ) : (
          <CardItem style={styles.item}>
            <Left>
              <Icon active name="person-outline" />
              <Text style={styles.title}>{singleItem.stopName}</Text>
            </Left>
            <Right>
              <Text style={styles.title}>{route.routes[0].legs[index - 1].duration.text} to here</Text>
            </Right>
          </CardItem>
        )
        }
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

export default StopListItem
