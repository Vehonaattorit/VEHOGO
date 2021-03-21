import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const SetUpInit = () => {
  return (
    <View style={styles.container}>
      <Text>Open up SetUpInit.js to start working on your app!</Text>
      <Text>Last view for setup</Text>
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
});
