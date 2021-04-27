import React, {useEffect} from 'react'
import {useState} from 'react'
import {
  StyleSheet,
  View,
  Button,
  Dimensions,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import {color} from '../../constants/colors'
import {Input} from 'react-native-elements'
import firebase from '../../firebase/fire'
import {CustomButton} from '../../components/CustomButton'
import {AuthButton} from '../../components/AuthButton'
import {CustomTitle} from '../../components/CustomTitle'
import {login, subscribeToAuth} from '../../controllers/LoginController'
import {Icon} from 'native-base'

export const LogIn = ({navigation, scrollRef}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const logIn = async () => {
    try {
      await login(email, password)
    } catch (error) {
      console.log('error', error.message)
      //error in login, safe to setError
      setError(error.message)
    }
  }

  useEffect(() => {
    let mounted = true
    let timeout
    if (mounted) {
      timeout = setTimeout(() => {
        setError('')
      }, 5000)
    }
    return () => {
      mounted = false
      clearTimeout(timeout)
    }
  }, [error])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Image
        source={require('../../images/vehogo_logo_musta_RGB.png')}
        style={{width: 150, height: 170, marginBottom: 30}}
      />
      <View style={{width: Dimensions.get('window').width * 0.8}}>
        <Input
          accessibilityLabel="Email"
          autoCapitalize="none"
          placeholder="Email"
          leftIcon={
            <Icon name="mail-outline" size={24} color={color.primary} />
          }
          value={email}
          onChangeText={setEmail}
        />

        <Input
          placeholder="Password"
          errorStyle={{color: 'red'}}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          leftIcon={
            <Icon name="lock-closed-outline" size={24} color={color.primary} />
          }
          errorMessage={error}
        />
      </View>
      <View style={styles.btnContainer}>
        <View style={styles.logInBtn}>
          <AuthButton style={styles.btns} title="Login" onPress={logIn} />
        </View>
        <AuthButton
          style={styles.btns}
          title="or register"
          type="text"
          onPress={() => {
            scrollRef.current.scrollTo({
              x: 2000,
              animated: true,
            })
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    borderRadius: 4,
    flexDirection: 'row',
  },
  logInBtn: {
    borderRadius: 4,
    overflow: 'hidden',
  },
})
