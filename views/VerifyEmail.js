import React, {useEffect, useContext} from 'react'
import {StyleSheet, Platform} from 'react-native'
import {Text, Icon, Button} from 'native-base'
import {View} from 'native-base'
import {checkEmailVerification} from '../controllers/LoginController'
import CustomIconButton from '../components/CustomIconButton'
import {FontAwesome} from '@expo/vector-icons'
import firebase from '../firebase/fire'

import {UserContext} from '../contexts'

export const VerifyEmail = ({navigation}) => {
  const {user} = useContext(UserContext)

  const checkEmail = async () => {
    // For cypress testing purposes
    if (Platform.OS === 'web') navigation.navigate('Company')
    else if ((Platform.OS === 'android' || Platform.OS === 'web') && __DEV__)
      navigation.navigate('Company')

    const result = await checkEmailVerification()
    if (result === true) {
      navigation.navigate('Company')
    }
  }

  const checkEmailWithButton = async () => {
    let user = firebase.auth().currentUser
    await user.reload()
    user = firebase.auth().currentUser
    await checkEmail()
  }

  useEffect(() => {
    checkEmail()
  }, [])

  return (
    <View style={styles.view}>
      <FontAwesome name="check-circle-o" size={300} color="#26AAE2" />
      <Text style={{margin: 5}}>Verify your email address.</Text>
      <Text style={{margin: 5}}>Email was sent to {user.emailAddress}</Text>
      <Text style={{margin: 5}}>Then press continue</Text>

      <CustomIconButton
        onPress={() => {
          checkEmailWithButton()
        }}
        title="Continue"
        iconTwo="keyboard-arrow-right"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
  },

  title: {
    fontSize: 30,
    margin: 10,
  },
})
