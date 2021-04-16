import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import CustomButtonIcon from '../components/CustomIconButton'

export const Settings = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.poweredContainer}>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Travel Info"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              navigation.navigate('Company')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Set-Up"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              navigation.navigate('Company')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Set-Up"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              navigation.navigate('Company')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Set-Up"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              navigation.navigate('Company')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Set-Up"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              navigation.navigate('Company')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Set-Up"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              navigation.navigate('Company')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Set-Up"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              navigation.navigate('Company')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomButtonIcon
            iconOne="person"
            title="Modify Your Set-Up"
            iconTwo="keyboard-arrow-right"
            onPress={() => {
              navigation.navigate('Company')
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
