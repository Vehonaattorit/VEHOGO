import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {color} from '../constants/colors';
export const SignUp = () => {
  return (
    <View style={styles.container}>
      <Text>Open up SignUp.js to start working on your app!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
