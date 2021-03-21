import React from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';

export const Travel = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.logInContainer}>
        <Button
          title="Share my car"
          onPress={() => {
            navigation.navigate('Address');
          }}
        />
      </View>
      <View style={styles.signUpContainer}>
        <Button title="Get a ride" onPress={() => {}} />
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
