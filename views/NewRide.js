import React from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Body, Container, View} from 'native-base'
import NewRideForm from './NewRideForm'


export const NewRide = () => {
  return (
    <View style={styles.view}>
      <Container style={styles.container}>
        <Content padder contentContainerStyle={styles.newRideContent}>
          <Card>
            <CardItem>
              <Body>
                <NewRideForm></NewRideForm>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    </View>

  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#26aae2',
  },
  newRideContent: {
    flex: 1,
    justifyContent: 'center'
  },

});


