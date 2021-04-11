import React, {useRef, useEffect} from 'react'
import {useState} from 'react'
import {StyleSheet, View, Dimensions, Image} from 'react-native'
import {Input} from 'react-native-elements'
import {color} from '../../constants/colors'
import Icon from 'react-native-vector-icons/FontAwesome'
import {register} from '../../controllers/LoginController'
import {AuthButton} from '../../components/AuthButton'

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
      <Image
        source={require('../../images/vehogo_logo_musta_RGB.png')}
        style={{width: 150, height: 170, marginBottom: 30}}
      />
      <View style={{width: Dimensions.get('window').width * 0.8}}>
        <Input
          autoCapitalize="none"
          leftIcon={<Icon name="user" size={24} color={color.primary} />}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          placeholder="Password"
          errorStyle={{color: 'red'}}
          leftIcon={<Icon name="lock" size={24} color={color.primary} />}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          errorMessage={error}
        />
      </View>

      <View style={styles.btnContainer}>
        <View style={styles.signUpBtn}>
          <AuthButton
            style={styles.btns}
            title="Register"
            width={300}
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
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    backgroundColor: 'black',
    borderRadius: 4,
  },
  signUpBtn: {
    borderRadius: 4,
    overflow: 'hidden',
  },
})
