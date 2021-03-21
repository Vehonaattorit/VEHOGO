import React from 'react';
import {StyleSheet, TextInput, Button, Text, View} from 'react-native';
import {color} from '../constants/colors';
export const Address = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.emailContainer}>
          <TextInput style={styles.input} placeholder="Address" />
        </View>
        <View style={styles.passwordContainer}>
          <TextInput style={styles.input} placeholder="City" />
        </View>
        <View style={styles.signUpContainer}>
          <Button
            title="Submit"
            onPress={() => {
              navigation.navigate('WorkingDays');
            }}
          />
        </View>
      </View>
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
  inputContainer: {
    marginHorizontal: 20,
    alignContent: 'space-between',
  },
  input: {
    padding: 10,
    margin: 5,
  },
  signUpContainer: {
    margin: 5,
    backgroundColor: 'yellow',
  },
});
