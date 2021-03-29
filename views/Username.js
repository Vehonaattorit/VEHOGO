import React, {createContext, useContext, useState} from 'react'
import {StyleSheet, Text, View, KeyboardAvoidingView} from 'react-native'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {AntDesign, FontAwesome} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'
import {UserContext} from '../contexts'

export const Username = ({navigation}) => {
  const {user} = useContext(UserContext)

  const [username, setUsername] = useState(user.userName || undefined)
  const [usernameError, setUsernameError] = useState('')

  const updateUserLocation = () => {
    user.userName = username

    updateUser(user)
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <CustomTitle title="Select username" />
      <View style={styles.icon}>
        {Platform.OS === 'ios' ? (
          <AntDesign name="user" size={300} color={color.secondaryDark} />
        ) : (
          <FontAwesome name="user" size={300} color={color.secondaryDark} />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={(value) => setUsername(value)}
        />
        <Text>{usernameError}</Text>

        <CustomButton
          style={styles.btns}
          title="Submit"
          onPress={() => {
            updateUserLocation()
            navigation.navigate('Address')
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 60,
    width: '90%',
    color: 'white',
  },
  icon: {
    marginBottom: 100,
  },
})
