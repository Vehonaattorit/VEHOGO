import React from 'react';
import {StyleSheet, View} from 'react-native';
import {color} from '../constants/colors';
import {Button, Input, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export const LogIn = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View >
        <Card elevation={7} >
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <Input
                placeholder="Email@Address.com"
                leftIcon={
                  <Icon name="" size={24} color={color.grey} />
                }
                style={styles}
                secureTextEntry={true}
                onChangeText={(value) => this.setState({comment: value})}
              />
            </View>
            <View style={styles.input}>
              <Input
                placeholder="Password"
                errorStyle={{color: 'red'}}
                leftIcon={
                  <Icon name="lock" size={24} color={color.grey} />
                }
                errorMessage="ENTER A VALID ERROR HERE"
              />
            </View>

            <View style={styles.btnsContainer}>
              <Button
                style={styles.btns}
                type="outline"
                title="Log In"
                onPress={() => {
                  navigation.navigate('Travel');
                }}
              />
            </View>
            <View style={styles.btnsContainer}>
              <Button
                style={styles.btns}
                type="outline"
                title="Sign Up"
                onPress={() => {
                  navigation.navigate('SignUp');
                }}
              />
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primaryLight
  },
  myCard: {
    backgroundColor: 'blue',
    borderRadius: 10,
    margin: 10,
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    width: 230,
  },
  btns: {
    padding: 20,
    color: "black"
  },
  btnsContainer: {
    margin: 3,
  },
});
