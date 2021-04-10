import React, {useContext, useState} from 'react'
import {StyleSheet, Alert, View, Text} from 'react-native'
import {Icon, Button} from 'native-base'
import {color} from '../constants/colors'
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons'
import {removeCar} from '../controllers/carController'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'

const DriverCarListItem = ({singleItem, navigation, loadCars}) => {
  const [showItem, setItemVisibility] = useState(true)

  const {user} = useContext(UserContext)

  const editItem = () => {
    navigation.navigate('CarEditForm', {editCar: singleItem})
  }

  const deleteItem = () => {
    Alert.alert(
      'Delete car',
      `Are you sure you want to ${singleItem.vehicleDescription}?`,
      [
        {text: 'No', style: 'default'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            console.log('user.id, singleItem', user.id, singleItem)

            await removeCar(user.id, singleItem)

            await loadCars()
          },
        },
      ]
    )
  }

  const selectCar = async () => {
    user.schoosedCarID = singleItem.id

    console.log('user.schoosedCarID', user.schoosedCarID)

    await updateUser(user)
  }

  return (
    <View style={styles.container}>
      <View style={styles.formItem}>
        <View style={styles.iconContainer}>
          <Icon active name="car-outline" />
        </View>
        <Text>{singleItem.registerNumber}</Text>
        <View
          style={{...styles.iconContainer, backgroundColor: color.lightBlue}}
        >
          <MaterialCommunityIcons
            name="seat-passenger"
            size={30}
            color={color.lightBlack}
          />
          <Text>{singleItem.availableSeats}</Text>
        </View>
        <View style={styles.listItemButtons}>
          <View>
            <Button
              style={{
                ...styles.listItemButton,
                backgroundColor: color.radicalRed,
              }}
              onPress={deleteItem}
            >
              <AntDesign name="delete" size={24} color="white" />
            </Button>
          </View>
          <View>
            <Button
              style={{
                ...styles.listItemButton,
                backgroundColor: color.darkBlue,
              }}
              onPress={editItem}
            >
              <AntDesign name="edit" size={24} color="white" />
            </Button>
          </View>
        </View>
      </View>
      <View style={styles.bottomRow}>
        {user.schoosedCarID === singleItem.id ? (
          <View style={styles.selectedCarContainer}>
            <Text style={{...styles.text, color: color.lightBlack}}>
              SELECTED CAR
            </Text>
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <AntDesign
                name="checkcircle"
                size={24}
                color={color.malachiteGreen}
              />
            </View>
          </View>
        ) : (
          <Button style={styles.selectCarButton} onPress={selectCar}>
            <Text style={styles.text}>SELECT CAR </Text>
          </Button>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 10,
  },
  listItemButton: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  selectedCarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
  },
  selectCarButton: {
    backgroundColor: color.darkBlue,
    justifyContent: 'center',
    width: '100%',
    borderRadius: 10,
  },
  listItemButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    alignItems: 'center',
    flex: 1,
  },

  bottomRow: {
    padding: 10,
    backgroundColor: color.lightBlue,
    borderBottomLeftRadius: 10,
    borderBottomEndRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },

  textInput: {
    color: color.lightBlack,
    marginLeft: 15,
    height: 40,
    fontSize: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: 'open-sans-regular',
    color: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  list: {
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  item: {
    backgroundColor: 'white',
  },
})

export default DriverCarListItem
