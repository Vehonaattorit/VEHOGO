import React, {useRef, useEffect} from 'react'
import {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {Input} from 'react-native-elements'
import {register} from '../controllers/LoginController'
import {AuthButtons} from '../components/AuthButtons'
import {CustomTitle} from '../components/CustomTitle'

export const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const mountedRef = useRef(true)

  const registerUser = () => {
    register(email, password)
      .then((res) => {
        if (!mountedRef.current) return null

        setError(res)
      })
      .catch((err) => {
        if (!mountedRef.current) return null
        setError(err)

        throw err
      })
  }

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

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
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="Password"
        errorStyle={{color: 'red'}}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        errorMessage={error}
      />

      <View style={styles.btnContainer}>
        <View style={styles.signUpBtn}>
          <AuthButtons
            style={styles.btns}
            title="Register"
            onPress={() => {
              registerUser()
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
    borderRadius: 10,
  },
  signUpBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
})
