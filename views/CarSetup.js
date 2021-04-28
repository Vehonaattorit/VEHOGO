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
  const [error, setError] = useState('')


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
      setError('All inputs must be min 1 character.')
      console.log('validate fail')
      return
    }
    console.log('uploading car')
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
          }}
        >
          <View style={styles.iconContainer}>
            <Icon active name="car-outline" />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Vehicle description"
              maxLength={30}
              autoCorrect={false}
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
          </View>
        </View>


        <View
          style={{
            ...styles.formItem,
            marginTop: 5
          }}
        >
          <View style={styles.iconContainer}>
            <Icon active name="document-text-outline" />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="characters"
              placeholder="Registration number"
              value={registration}
              onChangeText={setRegistration}
              style={styles.input}
            />
          </View>
        </View>


        <View
          style={{
            ...styles.formItem,

            marginTop: 5
          }}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="seat-passenger"
              size={30}
              color={color.lightBlack}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
              placeholder="Available seats"
              value={seats}
              onChangeText={seatsInputHandler}
              style={styles.input}
            />
          </View>
        </View>
        {error != '' &&
          <Text style={{alignSelf: 'center', color: 'red', marginTop: 5}}>{error}</Text>
        }
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10
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
  inputContainer: {
    flexDirection: 'column',
    flex: 1.5,
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15.5,
    fontSize: 15.5,
    borderRadius: 5,
    height: 50,
    fontFamily: 'open-sans-regular'
  },
})

export default CarSetup
