import React, {useState, useEffect, useContext} from 'react'
import {StyleSheet, Alert, Button, Platform, Text, View} from 'react-native'
import {color} from '../constants/colors'
import {CustomButton} from '../components/CustomButton'
import {RoundButton} from '../components/RoundButton'
import {CustomTitle} from '../components/CustomTitle'
import {EvilIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import {updateUser, userStream} from '../controllers/userController'

import {UserContext} from '../contexts'
import CustomButtonIcon from '../components/CustomIconButton'

export const WorkingDays = ({navigation}) => {
  const {user} = useContext(UserContext)
  const [workDays, setWorkDays] = useState([
    {id: 1, weekDay: 'Mon', isSelected: false},
    {id: 2, weekDay: 'Tue', isSelected: false},
    {id: 3, weekDay: 'Wed', isSelected: false},
    {id: 4, weekDay: 'Thu', isSelected: false},
    {id: 5, weekDay: 'Fri', isSelected: false},
    {id: 6, weekDay: 'Sat', isSelected: false},
    {id: 7, weekDay: 'Sun', isSelected: false},
  ])

  const [error, setError] = useState('')
  useEffect(() => {
    let workDayIds = []

    if (!user.workDays) return
    for (const workDay of workDays) {
      for (const userWorkDay of user.workDays) {
        if (workDay.id === userWorkDay.workDayNum) {
          workDayIds.push(workDay.id)
        }
      }
    }
    const newArr = workDays.map((item) =>
      item.id == workDayIds[item.id] ? {...item, isSelected: true} : item
    )
    setWorkDays(newArr)
  }, [])

  const toggleHandler = (selectedItem, isSelected) => {
    const newArr = workDays.map((item) => {
      if (item.id == selectedItem.id) {
        return {
          ...item,
          isSelected,
        }
      } else {
        return item
      }
    })

    setWorkDays(newArr)
  }

  const submitHandler = async () => {
    const isValid = workDays.some((item) => item.isSelected === true)

    if (!isValid) {
      Alert.alert('Wrong input!', 'Please select atleast one work day.', [
        {text: 'Okay'},
      ])
      setError('Please select at least one work day.')

      return
    }

    const preferedWorkDays = []

    workDays.forEach((element) => {
      if (element.isSelected) {
        preferedWorkDays.push({workDayNum: element.id})
      }
    })
    user.preferedWorkingHours = preferedWorkDays

    await updateUser(user)

    navigation.navigate('WorkingHours')
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [error])

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <EvilIcons name="calendar" size={300} color="#26AAE2" />
      </View>
      <Text style={styles.title}>
        Please enter the days you will be going to work
      </Text>
      <View style={styles.btnContainer}>
        {workDays.map((item) => (
          <RoundButton
            key={item.id}
            item={item}
            isSelected={item.isSelected}
            toggleHandler={toggleHandler}
          />
        ))}
      </View>
      <View style={styles.submitBtn}>
        <CustomButtonIcon
          title="Submit"
          onPress={submitHandler}
          iconTwo="keyboard-arrow-right"
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
    backgroundColor: '#fff',
  },
  btnContainer: {
    flexDirection: 'row',
    flex: 0.6,
  },
  iconContainer: {
    alignItems: 'center',

    flex: 1,
  },
  submitBtn: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  title: {
    margin: 15,
    fontSize: 24,
    flex: 0.3,
    textAlign: 'center',
  },
})
