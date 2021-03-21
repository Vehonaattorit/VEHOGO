import React from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';

export const WorkingDays = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Open up WorkingDays.js to start working on your app!</Text>
      <View style={styles.signUpContainer}>
        <Button
          title="Submit"
          onPress={() => {
            navigation.navigate('WorkingHours');
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
