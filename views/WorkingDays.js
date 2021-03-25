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
  console.log(workDays)
  const {user} = useContext(UserContext)

  const updateWorkDays = () => {
    const preferedWorkDays = []
    workDays.forEach(element => {
      preferedWorkDays.push({workDayNum: element})
    });
    user.preferedWorkingHours = preferedWorkDays
    updateUser(user)
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleText}>
        <CustomTitle title="Days" />
        <EvilIcons name="calendar" size={300} color={color.secondaryDark} />
      </View>

      <View style={styles.btnContainer}>
        <RoundButton title="Mon" onPress={() => setWorkDays(workDays.concat(0))}/>
        <RoundButton title="Tue" onPress={() => { setWorkDays(workDays.concat(1))}} />
        <RoundButton title="Wed" onPress={() => { setWorkDays(workDays.concat(2))}} />
        <RoundButton title="Thu" onPress={() => { setWorkDays(workDays.concat(3))}} />
        <RoundButton title="Fri" onPress={() => { setWorkDays(workDays.concat(4))}} />
        <RoundButton title="Sat" onPress={() => { setWorkDays(workDays.concat(5))}} />
        <RoundButton title="Sun" onPress={() => { setWorkDays(workDays.concat(6))}} />
      </View>
      <View style={styles.submitBtn}>
        <CustomButton
          title="Submit"
          onPress={() => {
            updateWorkDays()
            navigation.navigate('WorkingHours')
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
