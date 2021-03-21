import React from 'react';
import {StyleSheet, Button, View, TextInput} from 'react-native';

export const LogIn = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.emailContainer}>
            <TextInput style={styles.input} placeholder="Email" />
          </View>
          <View style={styles.passwordContainer}>
            <TextInput style={styles.input} placeholder="Password" />
          </View>
        </View>
        <View style={styles.logInContainer}>
          <Button
            title="Log In"
            onPress={() => {
              navigation.navigate('Travel');
            }}
          />
        </View>
        <View style={styles.signUpContainer}>
          <Button
            title="Sign Up"
            onPress={() => {
              navigation.navigate('SignUp');
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
    backgroundColor: '#fff',
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
  btnContainer: {
    padding: 20,
  },
  logInContainer: {
    margin: 5,
    backgroundColor: 'brown',
  },
  signUpContainer: {
    margin: 5,
    backgroundColor: 'yellow',
  },
});
