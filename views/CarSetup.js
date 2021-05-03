import React, {useState, useEffect, useContext} from 'react'
import {
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import {Text, View, Icon} from 'native-base'
import {getCars, updateCar} from '../controllers/carController'
import {Car} from '../models/car'
import {UserContext} from '../contexts'
import {color} from '../constants/colors'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'
import CustomButtonIcon from '../components/CustomIconButton'

const CarSetup = ({navigation}) => {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
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
              testID="vehicleDescInput"
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
            marginTop: 5,
          }}
        >
          <View style={styles.iconContainer}>
            <Icon active name="document-text-outline" />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              testID="registrationNumInput"
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

            marginTop: 5,
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
              testID="availableSeatsInput"
              placeholder="Available seats"
              value={seats}
              onChangeText={seatsInputHandler}
              style={styles.input}
            />
          </View>
        </View>
        {error != '' && (
          <Text style={{alignSelf: 'center', color: 'red', marginTop: 5}}>
            {error}
          </Text>
        )}
      </View>
      <CustomButtonIcon
        testID="carSetupContinueBtn"
        iconTwo="keyboard-arrow-right"
        title="Continue"
        onPress={uploadCar}
      />
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 15,
  },
  form: {
    margin: 20,
  },
  formItem: {
    backgroundColor: color.lightBlue,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
  },
  iconContainer: {
    padding: 5,
    marginVertical: 10,
    marginHorizontal: 5,
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
    flex: 1.8,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    fontSize: 15,
    borderRadius: 5,
    height: 50,
    fontFamily: 'open-sans-regular',
  },
})

export default CarSetup
