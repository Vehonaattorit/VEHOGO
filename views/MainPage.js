import React from 'react'
import {SafeAreaView, StyleSheet} from 'react-native'
import {Body, View, Text, Icon, Button} from 'native-base'
import {signOut} from '../controllers/LoginController'
import PendinRequestList from '../components/PendingRequestsList'

export const MainPage = ({navigation}) => {

  const signedOut = () => {
    navigation.navigate('LogIn')
  }
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

      <View style={styles.listView}>
        <PendinRequestList dataArray={data} navigation={navigation}></PendinRequestList>
      </View>

      <View style={styles.scheduleView}>
        <Button style={styles.button} onPress={() => navigation.navigate('OutlookCalendar') }><Text>Calender</Text></Button>
        <Button style={styles.button} onPress={() => signOut(signedOut)}><Text>LogOut</Text></Button>
        <Button style={styles.button} onPress={() => navigation.navigate('NewRide')}><Text>New Ride</Text></Button>
        <Button style={styles.button} onPress={() => navigation.navigate('DriverStartRide')}><Text>Start Ride</Text></Button>
      </View>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },

  listView: {
    flex: 1,
  },

  scheduleView: {
    flex: 1,
  },

  button: {
    alignSelf: 'center',
    margin: 2
  },

  titleText: {
    fontSize: 24
  }

});

