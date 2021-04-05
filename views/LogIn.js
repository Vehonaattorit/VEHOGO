import React, {useEffect} from 'react'
import {useState} from 'react'
import {StyleSheet, View, Button} from 'react-native'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from '../firebase/fire'
import {CustomButton} from '../components/CustomButton'
import {AuthButtons} from '../components/AuthButtons'
import {CustomTitle} from '../components/CustomTitle'
import {login, subscribeToAuth} from '../controllers/LoginController'

export const LogIn = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const logIn = async () => {
    // const errorMessage = await login(email, password)

    // setError(errorMessage)
    login(email, password)
      .then((res) => {
        setError(res)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [error])

  return (
    <View style={styles.container}>
      <CustomTitle title="VEHOGO" />
      <Input
        autoCapitalize="none"
        placeholder="email@address.com"
        leftIcon={<Icon name="" size={24} color={color.grey} />}
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="Password"
        errorStyle={{color: 'red'}}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        leftIcon={<Icon name="" size={24} color={color.grey} />}
        errorMessage={error}
      />
      <View style={styles.btnContainer}>
        <View style={styles.logInBtn}>
          <AuthButtons
            style={styles.btns}
            title="Login"
            onPress={() => {
              logIn()
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
    backgroundColor: 'black',
    borderRadius: 10,
  },
  logInBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
})
