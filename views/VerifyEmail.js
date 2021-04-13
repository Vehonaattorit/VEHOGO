import React, {useEffect} from 'react'
import {StyleSheet} from 'react-native'
import {Text, Icon, Button} from 'native-base'
import {View} from 'native-base'
import {checkEmailVerification} from '../controllers/LoginController'
import CustomIconButton from '../components/CustomIconButton'
import {FontAwesome} from '@expo/vector-icons'
import firebase from '../firebase/fire'

export const VerifyEmail = ({navigation}) => {

  const checkEmail = async () => {
    const result = await checkEmailVerification()
    console.log('email status', result)
    if (result === true) {
      navigation.navigate('Company')
    }
  }

  const checkEmailWithButton = async () => {
    let user = await firebase.auth().currentUser
    await user.reload()
    user = await firebase.auth().currentUser
    await checkEmail()

  }

  useEffect(() => {
    checkEmail()
  }, [])

  return (
    <View style={styles.view}>
      <FontAwesome name="check-circle-o" size={300} color="#26AAE2" />
      <Text style={{margin: 5}}>
        Verify your email from link you received to your email.
      </Text>
      <Text style={{margin: 5}}>
        Then click continue
      </Text>

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
