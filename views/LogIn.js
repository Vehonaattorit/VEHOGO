import React, {useEffect} from 'react'
import {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from '../firebase/fire'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {login, subscribeToAuth} from '../controllers/LoginController'
export const LogIn = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const logIn = () => {
    login(email, password, logInComplete)

  }
  const logInComplete = () => {
    navigation.navigate('MainPage')
  }

  useEffect(() => {
    subscribeToAuth(authStateChanged)
  })

  const authStateChanged = (user) => {
    if(user !== null) {
      navigation.navigate('MainPage')
    }
  }
  return (
    <View style={styles.container}>
      <CustomTitle title="VEHOGO" />

      <View>
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <Input
              placeholder="Email@Address.com"
              leftIcon={<Icon name="" size={24} color={color.grey} />}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.input}>
            <Input
              placeholder="Password"
              errorStyle={{color: 'red'}}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              leftIcon={<Icon name="" size={24} color={color.grey} />}
              errorMessage="ENTER A VALID ERROR HERE"
            />
          </View>
        </View>
        <View style={styles.btnsContainer}>
          <CustomButton
            title="Log In"
            onPress={() => {
              logIn()
            }}
          />
        </View>
        <View style={styles.btnsContainer}>
          <CustomButton
            title="Sign Up"
            onPress={() => {
              navigation.navigate('SignUp')
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
  inputContainer: {
    padding: 20,
  },
  input: {
    width: 230,
  },
  btnsContainer: {
    margin: 3,
  },
})
