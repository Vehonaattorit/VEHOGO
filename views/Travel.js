import React, {useContext, useEffect} from 'react'
import {StyleSheet, View, Platform} from 'react-native'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'
import CustomButtonIcon from '../components/CustomIconButton'
import {MaterialCommunityIcons} from '@expo/vector-icons'

export const Travel = ({navigation}) => {
  const {user} = useContext(UserContext)

  const setTravelPreference = async (preference) => {
    user.travelPreference = preference

    await updateUser(user)
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="car-sports" size={300} color="#26AAE2" />
      </View>
      <View style={styles.btnContainer}>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="directions-car"
            iconTwo="keyboard-arrow-right"
            title="Share My Car"
            onPress={() => {
              setTravelPreference('driver')
              navigation.navigate('Address')
            }}
          />
        </View>

        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="airline-seat-recline-extra"
            iconTwo="keyboard-arrow-right"
            title="Get A Ride"
            onPress={() => {
              setTravelPreference('passenger')
              navigation.navigate('Address')
            }}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  iconContainer: {
    flex: 0.9,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
  },
  btn: {
    marginTop: 5,
    alignSelf: 'stretch',
  },
})
