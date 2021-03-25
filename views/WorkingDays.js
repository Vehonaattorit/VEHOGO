import React, {useState, useContext} from 'react'
import {StyleSheet, Button, Platform, Text, View} from 'react-native'
import {color} from '../constants/colors'
import {CustomButton} from '../components/CustomButton'
import {RoundButton} from '../components/RoundButton'
import {CustomTitle} from '../components/CustomTitle'
import {EvilIcons, MaterialCommunityIcons} from '@expo/vector-icons'

import {updateUser} from '../controllers/userController'

import {User} from '../models/user'
import {UserContext} from '../contexts'

export const WorkingDays = ({navigation}) => {
  const [workDays, setWorkDays] = useState([])

  const {user} = useContext(UserContext)

  return (
    <View style={styles.container}>
      <View style={styles.titleText}>
        <CustomTitle title="Days" />
        <EvilIcons name="calendar" size={300} color={color.secondaryDark} />
      </View>

      <View style={styles.btnContainer}>
        <RoundButton
          title="Mon"
          onPress={() => setWorkDays(workDays.concat('Mon'))}
        />
        <RoundButton title="Tue" onPress={() => {}} />
        <RoundButton title="Wed" onPress={() => {}} />
        <RoundButton title="Thu" onPress={() => {}} />
        <RoundButton title="Fry" onPress={() => {}} />
        <RoundButton title="Sat" onPress={() => {}} />
        <RoundButton title="Sun" onPress={() => {}} />
      </View>
      <View style={styles.submitBtn}>
        <CustomButton
          title="Submit"
          onPress={() => {
            navigation.navigate('WorkingHours')

            updateUser(new User({id: user.id, workDays: workDays}))
          }}
        />
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
    flexDirection: 'row',
    marginBottom: 20,
  },
  titleText: {
    alignItems: 'center',
    marginBottom: 20,
  },
  submitBtn: {
    position: 'absolute',
    bottom: 50,
    width: '90%',
  },
})
