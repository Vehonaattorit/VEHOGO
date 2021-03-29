import React, {useState} from 'react'
import {StyleSheet, View, KeyboardAvoidingView, Text} from 'react-native'

export const JoinCompany = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Join company</Text>
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
