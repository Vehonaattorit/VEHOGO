import React from 'react';
import {StyleSheet, Text, Button, View} from 'react-native';

export const WorkingHours = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Open up WorkingHours.js to start working on your app!</Text>
      <View style={styles.signUpContainer}>
        <Button
          title="Submit"
          onPress={() => {
            navigation.navigate('setUpInit');
          }}
        />
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
  signUpContainer: {
    margin: 5,
    backgroundColor: 'yellow',
  },
});
