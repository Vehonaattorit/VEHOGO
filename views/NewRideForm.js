import React, {useState, useContext} from 'react'
import {StyleSheet} from 'react-native'
import {Button, Text, Item, Input, View, Icon, CardItem, Card} from 'native-base'
import {updateCar} from '../controllers/carController'
import {Car} from '../models/car';
import {UserContext} from '../contexts'


const NewRideForm = ({carId, setItemVisibility, setListVisibility, loadCars, modify}) => {

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [registration, setRegistration] = useState('')
  const [seats, setSeats] = useState('')
  const {user} = useContext(UserContext)

  const id = carId


  const uploadCar = async () => {
    const carId = await updateCar(user.id, new Car({id: id, driverName: name, vehicleDescription: description, registerNumber: registration, availableSeats: seats}))
    console.log('car id ' + carId)
  }
  return (
    <View style={styles.form}>

      <Item floatingLabel>
        <Icon active name='person-outline' />
        <Input
          placeholder='Driver Name'
          value={name}
          onChangeText={setName} />
      </Item>
      <Item floatingLabel style={{marginTop: 20}}>
        <Icon active name='car-outline' />
        <Input placeholder='Vehicle description'
          value={description}
          onChangeText={setDescription} />
      </Item>
      <Item floatingLabel style={{marginTop: 20}}>
        <Icon active name='document-text-outline' />
        <Input placeholder='Registration number'
          value={registration}
          onChangeText={setRegistration} />
      </Item>
      <Item floatingLabel style={{marginTop: 20, marginBottom: 20}}>
        <Icon active name='hand-right-outline' />
        <Input placeholder='Available seats'
          value={seats}
          onChangeText={setSeats} />
      </Item>

      {modify === true ?
        (
          <Button block style={styles.button} onPress={() => {uploadCar(); setItemVisibility(true); loadCars()}}><Text style={styles.txt}>Confirm ride</Text></Button>
        ):(
          <Button block style={styles.button} onPress={() => {uploadCar(); setListVisibility(true); loadCars()}} ><Text style={styles.txt}>Confirm Ride</Text></Button>
        )
      }

      {modify === true ?
        (
          <Button block style={styles.button} onPress={() => setItemVisibility(true)} ><Text style={styles.txt}>Cancel</Text></Button>
        ):(
          <Button block style={styles.button} onPress={() => setListVisibility(true)} ><Text style={styles.txt}>Cancel</Text></Button>
        )
      }


    </View>
  );
};
//Sss
const styles = StyleSheet.create({
  txt: {
    color: '#000000'
  },
  button: {
    backgroundColor: '#26aae2',
    margin: 5
  },
  form: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    margin: 10
  }
});



export default NewRideForm;
