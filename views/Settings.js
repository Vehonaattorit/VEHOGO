import React, {useState, useContext} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import CustomButtonIcon from '../components/CustomIconButton'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'

export const Settings = ({navigation}) => {
  const [travelModalVisible, SetTravelModalVisible] = useState(false)
  const [usernameModalVisible, SetUsernameModalVisible] = useState(false)
  const [homeModalVisible, SetHomeModalVisible] = useState(false)
  const [workModalVisible, SetWorkModalVisible] = useState(false)
  const [WorkingHoursModalVisible, SetWorkingHoursModalVisible] = useState(
    false
  )

  return (
    <View style={styles.container}>
      <View style={styles.poweredContainer}>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="airline-seat-recline-extra"
            title="Modify Your Travel Info"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log('Travel')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Username"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log('Username')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="home"
            title="Modify Your Address"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log('Address')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="work"
            title="Modify Your Worling Days"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log('Worling Days')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="access-time"
            title="Modify Your Working Hours"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log('Working Hours')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            style={styles.deleteBtn}
            iconOne="delete"
            title="DELETE YOUR ACCOUNT"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log('Working Hours')
            }}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  poweredContainer: {
    margin: 5,
  },
  btn: {
    marginTop: 10,
  },
  deleteBtn: {},
})
