import React, {useState} from 'react'
import {StyleSheet, Button, Platform, Text, View} from 'react-native'
import {color} from '../constants/colors'
import {CustomButton} from '../components/CustomButton'
import {RoundButton} from '../components/RoundButton'
import {CustomTitle} from '../components/CustomTitle'
import {Ionicons, EvilIcons} from '@expo/vector-icons'
export const WorkingDays = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleText}>
        <EvilIcons name="calendar" size={300} color={color.secondaryDark} />
        <CustomTitle title="Days" />
      </View>
      <View>
        <View style={styles.btnContainer}>
          <RoundButton title="Mon" onPress={() => {}} />
          <RoundButton title="Tue" onPress={() => {}} />
          <RoundButton title="Wed" onPress={() => {}} />
          <RoundButton title="Thu" onPress={() => {}} />
          <RoundButton title="Fry" onPress={() => {}} />
          <RoundButton title="Sat" onPress={() => {}} />
          <RoundButton title="Sun" onPress={() => {}} />
        </View>
        <CustomButton
          style={styles.submitBtn}
          title="Submit"
          onPress={() => {
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
    marginBottom: 100,
  },
  submitBtnContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
})
