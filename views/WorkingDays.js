import React, {useState, useEffect, useContext} from 'react'
import {StyleSheet, Button, Platform, Text, View} from 'react-native'
import {color} from '../constants/colors'
import {CustomButton} from '../components/CustomButton'
import {RoundButton} from '../components/RoundButton'
import {CustomTitle} from '../components/CustomTitle'
import {EvilIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import {updateUser, userStream} from '../controllers/userController'

import {UserContext} from '../contexts'

export const WorkingDays = ({navigation}) => {
  const {user} = useContext(UserContext)

  const updateWorkDays = () => {
    const preferedWorkDays = []

    workDays.forEach((element) => {
      if (element.isSelected) {
        preferedWorkDays.push({workDayNum: element.id})
      }
    })

    user.workDays = preferedWorkDays

    updateUser(user)
  }

  const [workDays, setWorkDays] = useState([
    {id: 0, weekDay: 'Mon', isSelected: false},
    {id: 1, weekDay: 'Tue', isSelected: false},
    {id: 2, weekDay: 'Wed', isSelected: false},
    {id: 3, weekDay: 'Thu', isSelected: false},
    {id: 4, weekDay: 'Fri', isSelected: false},
    {id: 5, weekDay: 'Sat', isSelected: false},
    {id: 6, weekDay: 'Sun', isSelected: false},
  ])

  useEffect(() => {
    let workDayIds = []

    if (!user.workDays) return

    for (const workDay of workDays) {
      for (const userWorkDay of user.workDays) {
        if (workDay.id === userWorkDay.workDayNum) {
          console.log('workDay.id', workDay.id)
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

  return (
    <View style={styles.container}>
      <View style={styles.titleText}>
        <CustomTitle title="Days" />
        <EvilIcons name="calendar" size={300} color={color.secondaryDark} />
      </View>

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
