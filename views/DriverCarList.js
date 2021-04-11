import React, {useEffect, useContext, useState} from 'react'
import {SafeAreaView, StyleSheet, FlatList} from 'react-native'
import {
  Content,
  Card,
  CardItem,
  Body,
  Container,
  View,
  Text,
  Icon,
  Button,
  Title,
} from 'native-base'
import {getCars} from '../controllers/carController'
import DriverCarListItem from '../components/DriverCarListItem'
import {UserContext} from '../contexts'
import NewRideForm from './NewRideForm'

export const DriverCarList = ({navigation}) => {
  const {user} = useContext(UserContext)
  const [carList, setCarList] = useState([])
  const [showList, setListVisibility] = useState(true)

  const loadCars = async () => {
    const carList = await getCars(user.id)
    setCarList(carList)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => loadCars())

    return unsubscribe
  }, [navigation])

  return (
    <View style={styles.view}>
      <View style={styles.listView}>
        <FlatList
          data={carList}
          renderItem={({item}) => (
            <DriverCarListItem
              singleItem={item}
              navigation={navigation}
              loadCars={loadCars}
            />
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },

  listView: {
    flex: 1,
    margin: 10,
  },

  button: {
    marginTop: 10,
  },
})
