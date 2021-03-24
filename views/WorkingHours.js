import React, {useState} from 'react'
import {StyleSheet,Platform, Text, Button, View} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import {color} from '../constants/colors'

import {CustomButton} from '../components/CustomButton'
export const WorkingHours = ({navigation}) => {
  const [date, setDate] = useState(new Date())

  return (
    <View style={styles.container}>
      <CustomButton title="Submit" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
