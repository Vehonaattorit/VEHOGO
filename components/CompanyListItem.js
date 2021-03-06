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
import {color} from '../constants/colors'
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
      await updateUser(user)
    } else {
    }
    navigation.navigate('Travel')
  }

  return (
    <Card style={styles.list}>
      <CardItem style={styles.item}>
        <Left>
          <Icon active name="pricetags-outline" />
          <Text style={styles.title}>{singleItem.displayName}</Text>
        </Left>
        <Right>
          <Button
            testID="joinCompanyBtn"
            style={{backgroundColor: color.cyan, borderRadius: 5}}
            onPress={() => joinCompany()}
          >
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
          <Icon active name="business-outline" />
          <Text style={styles.title}>{singleItem.city}</Text>
        </Left>
      </CardItem>
    </Card>
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
    backgroundColor: '#E1F5FD',
    borderRadius: 20,
  },
  item: {
    backgroundColor: color.lightBlue,
    borderRadius: 10,
  },
})

export default CompanyListItem
