import React, {useState, useEffect, useContext} from 'react'
import {StyleSheet, TextInput} from 'react-native'
import {
  Button,
  Text,
  View,
  Icon,
} from 'native-base'
import {getCars, updateCar} from '../controllers/carController'
import {Car} from '../models/car'
import {UserContext} from '../contexts'
import {color} from '../constants/colors'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'
import CustomButtonIcon from '../components/CustomIconButton'


const CarSetup = ({navigation, route}) => {

  const [description, setDescription] = useState('')
  const [registration, setRegistration] = useState('')
  const [seats, setSeats] = useState('')
  const {user} = useContext(UserContext)


  console.log('user', user)

  const validateForm = () => {
    const formDesc = description.trim().length > 0
    const formRegistration = registration.trim().length > 0
    const formSeats = seats.trim().length > 0

    if (formDesc && formRegistration && formSeats) {
      return true
    }

    return false
  }

  const uploadCar = async () => {
    if (!validateForm()) {
      return
    }

    //fetch cars if there is already one
    const cars = await getCars(user.id)
    console.log(cars)
    let carId = undefined
    if (cars.length > 0) {
      carId = cars[0].id
    }

    //console.log('car id',cars[0].id)
    const car = new Car({
      id: carId,
      driverName: user.userName,
      vehicleDescription: description,
      registerNumber: registration,
      availableSeats: seats,
    })

    await updateCar(user.id, car)
    user.schoosedCarID = car.id
    await updateUser(user)
    navigation.navigate('SetUpInit')

  }

  const seatsInputHandler = (inputText) => {
    setSeats(inputText.replace(/[^0-9]/g, ''))
  }

  useEffect(() => {
    navigation.setOptions({
      title: 'Add Car',
    })
  }, [])

  return (
    <View style={styles.container}>
      <View style={{alignSelf: 'center'}}>
        <MaterialCommunityIcons name="car-sports" size={250} color="#26AAE2" />
      </View>
      <View style={styles.form}>


        <View
          style={{
            ...styles.formItem,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <View style={styles.iconContainer}>
            <Icon active name="car-outline" />
          </View>
          <TextInput
            placeholder="Vehicle description"
            maxLength={30}
            autoCorrect={false}
            value={description}
            onChangeText={setDescription}
            style={styles.textInput}
          />
        </View>

        <View style={styles.breakPoint}></View>

        <View
          style={{
            ...styles.formItem,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <View style={styles.iconContainer}>
            <Icon active name="document-text-outline" />
          </View>
          <TextInput
            autoCapitalize="characters"
            placeholder="Registration number"
            value={registration}
            onChangeText={setRegistration}
            style={styles.textInput}
          />
        </View>
        <View style={styles.breakPoint}></View>

        <View
          style={{
            ...styles.formItem,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="seat-passenger"
              size={30}
              color={color.lightBlack}
            />
          </View>
          <TextInput
            keyboardType="numeric"
            maxLength={2}
            placeholder="Available seats"
            value={seats}
            onChangeText={seatsInputHandler}
            style={styles.textInput}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconTwo="keyboard-arrow-right"
            title="Continue"
            onPress={uploadCar}
          />
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    justifyContent: 'center'
  },
  button: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 15,
  },
  form: {
    margin: 10,
  },
  formItem: {
    backgroundColor: color.lightBlue,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
    margin: 10,
  },
  textInput: {
    color: color.lightBlack,
    marginLeft: 15,
    height: 40,
    fontSize: 20,
  },
  text: {
    fontFamily: 'open-sans-regular',
    color: color.lightBlack,
  },
  breakPoint: {
    height: 1,
    backgroundColor: color.grey,
  },
})

export default CarSetup
