import React from 'react'
import {StyleSheet, View} from 'react-native'
import {CustomButton} from '../components/CustomButton'
import {signOut} from '../controllers/LoginController'
export const Travel = ({navigation}) => {

  const signOutComplete = () => {
    navigation.navigate('LogIn')
  }
  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <View style={styles.btn}>
          <CustomButton
            title="Share My Car "
            onPress={() => {
              navigation.navigate('Address')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButton
            title="Get A Ride "
            onPress={() => {
              navigation.navigate('Address')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButton
            title="Log Out"
            onPress={() => {
              signOut(signOutComplete)
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
    alignSelf: 'stretch',
  },
})
