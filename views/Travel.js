import React, {useContext} from 'react'
import {StyleSheet, View, Button, Text, Icon} from 'react-native'
import {signOut} from '../controllers/LoginController'
import AntIcon from 'react-native-vector-icons/AntDesign'
import {CustomTitle} from '../components/CustomTitle'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'
import {CustomButtonIcon} from '../components/CustomButtonIcon'

export const Travel = ({navigation}) => {
  const {user} = useContext(UserContext)

  const setTravelPreference = (preference) => {
    user.travelPreference = preference

    updateUser(user)
  }

  return (
    <View style={styles.container}>
      <CustomTitle title="Travel" />
      <View style={styles.icon}>
        <AntIcon name="home" size={300} />
      </View>
      <View style={styles.btnContainer}>
        <Text style={{color: 'white'}}>I would like:</Text>
        <View style={styles.btns}>
          <View style={styles.btn}>
            <CustomButtonIcon
              style={styles.btn}
              title="Share My Car"
              onPress={() => {
                setTravelPreference('driver')
                navigation.navigate('Username')
              }}
            />
          </View>
          <View style={styles.btn}>
            <CustomButtonIcon
              iconOne=""
              title="Get A Ride"
              onPress={() => {
                setTravelPreference('passenger')
                navigation.navigate('Username')
              }}
              iconTwo={<Icon name="arrow-right" size={15} color="white" />}
            />
          </View>
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
    bottom: 0,
    width: '100%',
    padding: 30,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 63,
    borderTopRightRadius: 63,
  },
  btn: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 100,
  },
  icon: {
    marginBottom: 200,
  },
})
