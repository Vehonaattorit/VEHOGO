import React, {useContext} from 'react'
import {StyleSheet, Text, View} from 'react-native'

import {UserContext} from '../contexts'
import {color} from '../constants/colors'
import {Input} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {AntDesign, FontAwesome} from '@expo/vector-icons'
import {updateUser} from '../controllers/userController'

export const SetUpInit = ({route}) => {
  const {user} = useContext(UserContext)

  const finishSetup = () => {
    if (!user.setupIsCompleted) {
      console.log('Setup is completed')
      user.setupIsCompleted = true
      updateUser(user)
    }
  }

  return (
    <View style={styles.container}>
      <CustomTitle title="You are done." />
      <View style={styles.icon}>
        {Platform.OS === 'ios' ? (
          <AntDesign name="user" size={300} color={color.secondaryDark} />
        ) : (
          <FontAwesome name="user" size={300} color={color.secondaryDark} />
        )}
      </View>
      <View style={styles.inputContainer}>
        <CustomButton
          style={styles.btns}
          title="Finish setup"
          onPress={() => {
            finishSetup()
            // navigation.navigate('Address')
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
})
