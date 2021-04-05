import React, {useState} from 'react'
import {StyleSheet, View, Button, Text} from 'react-native'
import {AuthButtons} from '../components/AuthButtons'
import {LogIn} from './LogIn'
import {SignUp} from './SignUp'

export const AuthPage = () => {
  const [view, setView] = useState('Login')

  return (
    <View style={styles.container}>
      <View style={styles.AuthContainer}>
        {view === 'Login' && <LogIn />}
        {view === 'Register' && <SignUp />}
      </View>
      <View style={styles.btnContainer}>
        <View style={styles.btns}>
          <AuthButtons
            title="Login"
            onPress={() => {
              setView('Login')
            }}
          />
          <AuthButtons
            title="Register"
            onPress={() => {
              setView('Register')
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
  AuthContainer: {
    alignSelf: 'stretch',
    flex: 0.8,
  },
  btnContainer: {
    backgroundColor: '#000000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  btns: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
  },
})
