import * as React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Constants from 'expo-constants';
import Icon from 'react-native-ionicons';

export const CustomButtonIcon = ({ onPress, title, iconOne, iconTwo }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.container}>
        <Icon name={iconOne} size={40} color="white" />
        <View style={styles.buttonViewContainer}>
          <Text style={styles.buttonText}>{title}</Text>
          <Icon name={iconTwo} size={40} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },

  buttonContainer: {
    elevation: 8,
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  buttonViewContainer: {
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 30,
  },
  buttonText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
    marginRight: 20,
  },
});
