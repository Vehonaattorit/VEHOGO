import React, {useEffect, useContext, useState} from 'react'
import {SafeAreaView, StyleSheet, FlatList} from 'react-native'
import {Content, Card, CardItem, Body, Container, View, Text, Icon, Button, Title} from 'native-base'
import PassengerList from './PassengerList'
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
    console.log(carList)
    setCarList(carList)
  }

  useEffect(() => {
    loadCars()
  }, [])

  return (
    <SafeAreaView style={styles.view}>

      {showList ? (
        <>
          <Button block style={styles.button} onPress={() => {setListVisibility(false)}} ><Text>create Car</Text></Button>
          <View style={styles.listView}>
            <FlatList
              data={carList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) =>
                <DriverCarListItem singleItem={item} navigation={navigation} loadCars={loadCars} />
              }
            />
          </View>
        </>
      ) : (
        <NewRideForm setListVisibility={setListVisibility} modify={false} loadCars={loadCars}></NewRideForm>
      )
      }
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#26aae2',
  },

  listView: {
    flex: 1,
  },

  button: {
    marginTop: 10
  }

});
