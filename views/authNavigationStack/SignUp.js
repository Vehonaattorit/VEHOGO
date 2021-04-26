import React, {useRef, useEffect} from 'react'
import {useState} from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
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

  const mountedRef = useRef(true)

  const registerUser = async () => {
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    let passwordRegex = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if (!emailReg.test(email)) {
      setError('Email must be email type.')
    } else if (phoneNumber.length < 1) {
      setError('Phone number must be min 1 number long.')
    } else if (name.length < 1) {
      setError('Fullname must be min 1 character long')
    } else if (!passwordRegex.test(password)) {
      setError('Password must have 8 characters, one upper case and one digit.')
    } else if (password != confirmPassword) {
      setError('Passwords do not match')
    } else {
      try {
        const result = await register(email, password)

        if (result.type === 'error') {
          setConfirmError(result.message)

          return
        }

        await updateUser(
          new User({
            id: result.user.uid,
            userName: name,
            email: email,
            phoneNumber: phoneNumber,
          })
        )
      } catch (error) {
        setError('Register failed. Account with this email may already exist.')
      }
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
    }, 7500)

    return () => clearTimeout(timeout)
  }, [error])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      style={styles.container}
    >
      <View style={styles.poweredContainer}>
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
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            placeholder="Enter your phone number"
            errorStyle={{color: 'red'}}
            leftIcon={
              <Icon name="call-outline" size={24} color={color.primary} />
            }
            value={phoneNumber}
            keyboardType="numeric"
            onChangeText={setPhoneNumber}
          />

          <Input
            placeholder="Enter your full name"
            errorStyle={{color: 'red'}}
            leftIcon={
              <Icon name="person-outline" size={24} color={color.primary} />
            }
            value={name}
            onChangeText={setName}
          />
          <Input
            placeholder="Password"
            errorStyle={{color: 'red'}}
            leftIcon={
              <Icon
                name="lock-closed-outline"
                size={24}
                color={color.primary}
              />
            }
            keyboardType="default"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <Input
            placeholder="Confirm Password"
            errorStyle={{color: 'red'}}
            leftIcon={
              <Icon
                name="lock-closed-outline"
                size={24}
                color={color.primary}
              />
            }
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poweredContainer: {
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
