import React, {useRef, useEffect} from 'react'
import {useState} from 'react'
import {StyleSheet, View, Dimensions, Image} from 'react-native'
import {Input} from 'react-native-elements'
import {color} from '../../constants/colors'
import {register} from '../../controllers/LoginController'
import {AuthButton} from '../../components/AuthButton'
import {Icon} from 'native-base'
import {updateUser} from '../../controllers/userController'
import {User} from '../../models/user'

export const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [name, setName] = useState('')

  const [error, setError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [additionalError, setAdditionalError] = useState('')

  const mountedRef = useRef(true)

  const registerUser = async () => {
    setAdditionalError('')
    if (phoneNumber.length > 0 && name.length > 0) {
      if (password === confirmPassword) {
        setConfirmError('')
        const result = await register(email, password)
        await updateUser(
          new User({
            id: result.user.uid,
            userName: name,
            email: email,
            phoneNumber: phoneNumber,
          })
        )
          .then((res) => {
            if (!mountedRef.current) return null

            setError(res)
          })
          .catch((err) => {
            if (!mountedRef.current) return null
            setError(err)

            throw err
          })
      } else {
        setConfirmError('Passwords do not match')
      }
    } else {
      setAdditionalError('Name and Phone number must be at least 1 char long')
    }
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
          leftIcon={
            <Icon name="mail-outline" size={24} color={color.primary} />
          }
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          placeholder="Phone Number"
          errorStyle={{color: 'red'}}
          leftIcon={
            <Icon name="call-outline" size={24} color={color.primary} />
          }
          value={phoneNumber}
          keyboardType="numeric"
          onChangeText={setPhoneNumber}
          errorMessage={additionalError}
        />

        <Input
          placeholder="Full Name"
          errorStyle={{color: 'red'}}
          leftIcon={
            <Icon name="person-outline" size={24} color={color.primary} />
          }
          value={name}
          onChangeText={setName}
          errorMessage={additionalError}
        />
        <Input
          placeholder="Password"
          errorStyle={{color: 'red'}}
          leftIcon={
            <Icon name="lock-closed-outline" size={24} color={color.primary} />
          }
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          errorMessage={error}
        />
        <Input
          placeholder="Confirm Password"
          errorStyle={{color: 'red'}}
          leftIcon={
            <Icon name="lock-closed-outline" size={24} color={color.primary} />
          }
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          errorMessage={confirmError}
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
