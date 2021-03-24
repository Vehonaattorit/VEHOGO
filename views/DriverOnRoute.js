import React from 'react'
import {StyleSheet, Dimensions} from 'react-native'
import {Content, Body, Container, Text, View, Icon, Button} from 'native-base'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';

export const DriverOnRoute = ({navigation}) => {

  const origin = {latitude: 60.169929425303415, longitude: 24.938383101854694};
  const destination = {latitude: 60.203218047839, longitude: 24.65566529896304};
  const apikey = 'Your api key here'
  return (
    <View style={styles.view}>

      <Container style={styles.requestAcceptRefuseContent}>
        <Content padder >

          <View style={styles.info}>
            <Text>Michael Lock</Text>
            <Text>2km</Text>
          </View>

          <View style={styles.info}>
            <Text>Olen etuovella</Text>
            <Button small onPress={navigation.navigate('Chat')}><Icon active name='chatbox-ellipses-outline' /></Button>
          </View>

        </Content>
      </Container>

      <View style={styles.requestMapContent}>
        <MapView style={styles.mapStyle} provider={MapView.PROVIDER_GOOGLE}
          initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}>

          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={apikey}
          />

        </MapView>
      </View>

    </View>

  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#26aae2',
  },
  requestMapContent: {
    flex: 5,
    backgroundColor: 'black',
  },
  requestAcceptRefuseContent: {
    flex: 1,
    backgroundColor: 'white'
  },

  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

});

