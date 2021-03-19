import React from 'react'
import {SafeAreaView, StyleSheet} from 'react-native'
import {Content, Card, CardItem, Body, Container, View, Text, Icon, Button} from 'native-base'
import PassengerList from './PassengerList'


const DriverStartRide = () => {
  let data = [
    {
      key: 1,
      name: 'Tommi',
      address: 'kaarimäki 3',
      city: 'Vantaa',
      distance: 2
    },
    {
      key: 2,
      name: 'Michael',
      address: 'Siltakuja 2',
      city: 'Espoo',
      distance: 3
    },
    {
      key: 3,
      name: 'Maija',
      address: 'esimerkkikuja 6',
      city: 'Espoo',
      distance: 4
    }

  ];
  return (
    <SafeAreaView style={styles.view}>

      <View style={styles.iconView}>
        <Body style={styles.iconViewBody}>
          <Icon style={styles.icon} active name='car-outline' />
          <Text style={styles.iconText}>Your Next Ride</Text>
          <Button large style={styles.button} ><Text style={styles.btntxt}>Start Driving</Text></Button>
          <Text style={styles.iconText}>Your Passengers</Text>
        </Body>
      </View>

      <View style={styles.listView}>
          <PassengerList dataArray={data}></PassengerList>
      </View>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 30,
  },

  iconView: {
    flex: 2.5,
    backgroundColor: 'white'
  },
  iconViewBody: {
    flex: 1
  },
  icon: {
    fontSize: 200,
    flex: 3,
    color: '#26aae2',
  },
  iconText: {
    fontSize: 30,
    flex: 0.75,
  },

  listView: {
    flex: 3,
  },


  button: {
    backgroundColor: '#26aae2',
    borderRadius: 15,
    alignSelf: 'center',
    flex: 0.5

  },
  btntxt: {
    color: 'white'
  },


});

export default DriverStartRide
