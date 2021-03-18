import React from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Body, Container} from 'native-base'
import NewRideForm from '../VehoKimppa/NewRideForm'


const NewRide = () => {
  return (

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

  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#26aae2',
    marginTop: 30
  },
  newRideContent: {
    flex: 1,
    justifyContent:'center'
  },

});

export default NewRide
