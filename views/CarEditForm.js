import React, {useState, useEffect, useContext} from 'react'
import {StyleSheet, TextInput} from 'react-native'
import {Button, Text, View, Icon} from 'native-base'
import {updateCar} from '../controllers/carController'
import {Car} from '../models/car'
import {UserContext} from '../contexts'
import {color} from '../constants/colors'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'
import {updateUserCarToWorkTrips} from '../utils/updateWorkTripCar'

const CarEditForm = ({navigation, route}) => {
  const editCar = route.params !== undefined ? route.params.editCar : undefined

  const [description, setDescription] = useState(
    editCar !== undefined ? editCar.vehicleDescription : ''
  )
  const [registration, setRegistration] = useState(
    editCar !== undefined ? editCar.registerNumber : ''
  )
  const [seats, setSeats] = useState(
    editCar !== undefined ? editCar.availableSeats : ''
  )
  const {user} = useContext(UserContext)

  const validateForm = () => {
    const formDesc = description.trim().length > 0
    const formRegistration = registration.trim().length > 0
    const formSeats = seats.trim().length > 0

    if (formDesc && formRegistration && formSeats) {
      return true
    }

    return false
  }

  const cancel = () => {
    navigation.goBack()
  }

  const uploadCar = async () => {
    if (!validateForm()) {
      return
    }

    const car = new Car({
      id: editCar !== undefined ? editCar.id : undefined,
      driverName: user.userName,
      vehicleDescription: description,
      registerNumber: registration,
      availableSeats: seats,
    })

    await updateCar(user.id, car)

    user.schoosedCarID = car.id

    await updateUser(user)
    await updateUserCarToWorkTrips(user)
    navigation.goBack()
  }

  const seatsInputHandler = (inputText) => {
    setSeats(inputText.replace(/[^0-9]/g, ''))
  }

  useEffect(() => {
    let headerTitle
    if (route.params !== undefined) {
      headerTitle = 'Edit Car'
    } else {
      headerTitle = 'Add Car'
    }

    navigation.setOptions({
      title: headerTitle,
    })
  }, [])

  return (
    <View style={styles.container}>
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
        <Button
          onPress={uploadCar}
          style={{...styles.button, backgroundColor: color.malachiteGreen}}
          large
        >
          <Text style={styles.text}>Save</Text>
        </Button>
        <Button
          onPress={cancel}
          style={{...styles.button, backgroundColor: color.radicalRed}}
          large
        >
          <Text style={styles.text}>Cancel</Text>
        </Button>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  button: {
    marginTop: 20,
    alignSelf: 'stretch',
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
    backgroundColor: 'white',
    borderRadius: 10,
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

export default CarEditForm
