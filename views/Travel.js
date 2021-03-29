import React, {useContext} from 'react'
import {StyleSheet, View, Platform} from 'react-native'
import {CustomButton} from '../components/CustomButton'
import {signOut} from '../controllers/LoginController'
import {Ionicons} from '@expo/vector-icons'
import {color} from '../constants/colors'
import {CustomTitle} from '../components/CustomTitle'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'

export const Travel = ({navigation}) => {
  const {user} = useContext(UserContext)

  const setTravelPreference = (preference) => {
    user.travelPreference = preference
    updateUser(user)
  }

  return (
    <View style={styles.container}>
      <CustomTitle title="Travel" />
      {Platform.OS === 'ios' ? (
        <Ionicons name="ios-car" size={300} color={color.secondaryDark} />
      ) : (
        <Ionicons name="md-car" size={300} color={color.secondaryDark} />
      )}
      <View style={styles.btnContainer}>
        <View style={styles.btn}>
          <CustomButton
            title="Share My Car"
            onPress={() => {
              setTravelPreference('driver')
              navigation.navigate('Username')
            }}
          />
        </View>

        <View style={styles.btn}>
          <CustomButton
            title="Get A Ride"
            onPress={() => {
              setTravelPreference('passenger')
              navigation.navigate('Username')
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
  },
  btnContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  btn: {
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'stretch',
  },
})
