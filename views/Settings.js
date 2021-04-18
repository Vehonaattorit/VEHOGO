import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import CustomButtonIcon from '../components/CustomIconButton'

export const Settings = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.poweredContainer}>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="airline-seat-recline-extra"
            title="Modify Your Travel Info"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
             console.log("Travel")
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Username"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log("Username")
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="home"
            title="Modify Your Address"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log("Address")
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="work"
            title="Modify Your Worling Days"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log("Worling Days")
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="access-time"
            title="Modify Your Working Hours"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              console.log("Working Hours")
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
  },
  poweredContainer: {
    margin: 5,
  },
  btn: {
    marginTop: 10,
  },
})
