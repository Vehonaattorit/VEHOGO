import React from 'react'
import {StyleSheet} from 'react-native'
import {Content, Card, CardItem, Body, Container, View, Item, Icon, Input} from 'native-base'
import NewRideForm from './NewRideForm'


export const Chat = () => {
  return (
    <View style={styles.view}>
      <View style={styles.chatContainer}></View>
      <View style={styles.messageContainer}>
        <Item floatingLabel style={{marginTop: 20}}>

          <Input placeholder='Registration number' />
          <Icon active name='document-text-outline' />
        </Item>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatContainer: {
    flex: 6,
    backgroundColor: '#26aae2',
  },
  messageContainer: {
    flex: 1,
    backgroundColor: 'yellow'
  },

});

