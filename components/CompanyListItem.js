import React, {useContext} from 'react'
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
import {updateCompany} from '../controllers/companyController'
import {UserContext} from '../contexts'
import {Company} from '../models/company'
import {updateUser} from '../controllers/userController'

export const CompanyListItem = ({singleItem, navigation}) => {
  const {user} = useContext(UserContext)

  const joinCompany = async () => {
    if (!singleItem.userIDs.includes(user.id)) {
      const users = singleItem.userIDs
      users.push(user.id)
      console.log(users)
      const companyId = await updateCompany(
        new Company({id: singleItem.id, userIDs: users})
      )
      console.log('joined company')

      const companyUserData = [
        {
          address: singleItem.address,
          name: singleItem.displayName,
          location: singleItem.location,
          id: companyId,
        },
      ]

      console.log('data id', companyId)

      console.log('updating user')
      user.company = companyUserData
      updateUser(user)
    } else {
      console.log('already joined')
    }
    navigation.navigate('Travel')
  }

  return (
    <Content>
      <Card style={styles.list}>
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="home-outline" />
            <Text style={styles.title}>Company: {singleItem.displayName}</Text>
          </Left>
          <Right>
            <Button onPress={() => joinCompany()}>
              <Text>Join</Text>
            </Button>
          </Right>
        </CardItem>
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="location-outline" />
            <Text style={styles.title}>{singleItem.address}</Text>
          </Left>
        </CardItem>
        <CardItem style={styles.item}>
          <Left>
            <Text style={styles.title}>City: {singleItem.city}</Text>
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
