import React from 'react';
import {StyleSheet, Button, View} from 'react-native';

export const LogIn = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <View style={styles.logInContainer}>
          <Button title="Log In" onPress={() => {}} />
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
    justifyContent: 'center',
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
