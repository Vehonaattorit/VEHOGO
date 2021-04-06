import React, {useEffect, useState} from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon} from 'native-base'
import {getUser} from '../controllers/userController'

const StopListItem = ({navigation, singleItem}) => {

  const [stopUserInfo, setStopUserInfo] = useState([])

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
        <CardItem style={styles.item}>
        <Icon active name="person-outline" />
          <Text style={styles.title}>{singleItem.stopName}</Text>
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

export default StopListItem
