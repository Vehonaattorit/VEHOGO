import React from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Body, Container, Text} from 'native-base'


const DriverAcceptRefuse = () => {
  return (

    <Container style={styles.container}>
      <Content padder contentContainerStyle={styles.requestMapContent}>
            <Body>
              <Text>inside accept passenger</Text>
            </Body>
      </Content>
      <Content padder contentContainerStyle={styles.requestMContent}>
            <Body>
              <Text>inside accept passenger</Text>
            </Body>
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
  driverRequestContent: {
    flex: 1,
    justifyContent:'center'
  },

});

export default DriverAcceptRefuse
