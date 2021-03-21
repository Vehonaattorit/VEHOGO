import React from 'react'
import {StyleSheet} from 'react-native'
import {Content, Body, Container, Text, View, Icon} from 'native-base'


const DriverAcceptRefuse = () => {
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
            <Icon active name='chatbox-ellipses-outline' />
          </View>

        </Content>
      </Container>

      <Container style={styles.requestMapContent}>
        <Content padder >
          <Body>
          </Body>
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
    flex: 6,
    backgroundColor: 'black'
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

});

export default DriverAcceptRefuse
