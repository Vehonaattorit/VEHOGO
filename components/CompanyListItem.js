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
      const companyId = await updateCompany(
        new Company({id: singleItem.id, userIDs: users})
      )

      const companyUserData = {
        address: singleItem.address,
        name: singleItem.displayName,
        location: singleItem.location,
        id: companyId,
      }

      user.company = companyUserData
      updateUser(user)
    } else {
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
              <Text style={styles.text}>Join</Text>
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
  text: {
    fontFamily: 'open-sans-regular',
  },
  title: {
    fontFamily: 'open-sans-regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  list: {
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
  },
  item: {
    backgroundColor: '#EAEAEA',
  },
})

export default CompanyListItem
