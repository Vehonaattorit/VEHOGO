import React, {createContext, useContext, useState} from 'react'
import {StyleSheet, View, KeyboardAvoidingView} from 'react-native'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {AntDesign, FontAwesome} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'
import {UserContext} from '../contexts'

export const Address = ({navigation}) => {
  const [address, setAddress] = useState(undefined)
  const [city, setCity] = useState(undefined)

  const {user} = useContext(UserContext)

  console.log('Addresss user', user)

  const updateUserLocation = () => {
    user.homeAddress = address
    user.city = city
    updateUser(user)
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <CustomTitle title="Address" />
      <View style={styles.icon}>
        {Platform.OS === 'ios' ? (
          <AntDesign name="home" size={300} color={color.secondaryDark} />
        ) : (
          <FontAwesome name="home" size={300} color={color.secondaryDark} />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Address"
          value={address}
          onChangeText={(value) => setAddress(value)}
        />

        <Input
          placeholder="City"
          value={city}
          onChangeText={(value) => setCity(value)}
        />

        <CustomButton
          style={styles.btns}
          title="Submit"
          onPress={() => {
            updateUserLocation()
            navigation.navigate('WorkingDays')
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 60,
    width: '90%',
    color: 'white',
  },
  icon: {
    marginBottom: 100,
  },
})
