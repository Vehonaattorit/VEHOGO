import React from 'react'
import {StyleSheet, Dimensions} from 'react-native'
import {Content, Body, Container, Text, View, Button} from 'native-base'
import MapView from 'react-native-maps'

const DriverAcceptRefuse = () => {
  return (
    <View style={styles.view}>

      <Container style={styles.requestMapContent}>
      <MapView style={styles.mapStyle} provider={MapView.PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 60.169929425303415,
            longitude: 24.938383101854694,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}>
          <MapView.Marker
            coordinate={{
              latitude: 60.169929425303415,
              longitude: 24.938383101854694,
            }}
            title='Random place'
          />
        </MapView>
      </Container>

      <Container style={styles.requestAcceptRefuseContent}>

        <Content padder >
          <View style={styles.info}>
            <Text>Michael Lock</Text>
            <Text>2km</Text>
          </View>

          <Text style={{margin: 10}}>Adress</Text>

          <View style={styles.buttons}>
            <Button large style={styles.button} ><Text style={styles.btntxt}>Accept</Text></Button>
            <Button large style={styles.button} ><Text style={styles.btntxt}>Refuse</Text></Button>
          </View>
        </Content>
      </Container>

    </View>

  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#26aae2',
    marginTop: 30,
  },
  requestMapContent: {
    flex: 3,
    backgroundColor: 'black'
  },
  requestAcceptRefuseContent: {
    flex: 1,
    backgroundColor: 'white'
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  button: {
    backgroundColor: '#26aae2',
    borderRadius: 15,

  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10
  },
  btntxt: {
    color:'white'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default DriverAcceptRefuse
