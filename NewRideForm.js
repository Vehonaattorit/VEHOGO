import React from 'react'
import {StyleSheet} from 'react-native'
import {Button, Text, Item, Input, View, Icon} from 'native-base'

const NewRideForm = () => {

  return (
    <View style={{alignSelf: 'stretch'}}>
      <Item floatingLabel>
      <Icon active name='person-outline' />
            <Input placeholder='Driver Name'/>
      </Item>
      <Item floatingLabel style={{marginTop: 20}}>
        <Icon active name='car-outline' />
            <Input placeholder='Vehicle description'/>
      </Item>
      <Item floatingLabel style={{marginTop: 20}}>
        <Icon active name='document-text-outline' />
            <Input placeholder='Registration number'/>
      </Item>
      <Item floatingLabel style={{marginTop: 20, marginBottom: 20}}>
        <Icon active name='hand-right-outline' />
            <Input placeholder='Available seats'/>
      </Item>
      <Button block style={styles.confirmBtn} ><Text style={styles.txt}>Confirm Ride</Text></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  txt: {
    color:'#000000'
  },
  confirmBtn: {
    backgroundColor: '#26aae2'
  }
});



export default NewRideForm;
