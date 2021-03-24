import React from 'react';
import {useState} from 'react'
import {StyleSheet, View} from 'react-native';
import {color} from '../constants/colors';
import {Button, Input, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../firebase/fire'

export const SignUp = ({navigation}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = async() => {
    try {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
      console.log('Register success')
      navigation.navigate('Travel')
    }catch(err){
      console.log('register failed' + err)
    }
  }
  return (
    <View style={styles.container}>
        <Card elevation={7}>
          <View style={styles.inputContainer}>

            <View style={styles.input}>
              <Input
                placeholder="Email@Address.com"
                leftIcon={<Icon name="" size={24} color={color.grey} />}
                value = {email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.input}>
              <Input
                placeholder="Password"
                errorStyle={{color: 'red'}}
                secureTextEntry={true}
                value = {password}
                onChangeText={setPassword}
                leftIcon={<Icon name="lock" size={24} color={color.grey} />}
                errorMessage="ENTER A VALID ERROR HERE"
              />
            </View>
            <View style={styles.btnsContainer}>
              <Button
                style={styles.btns}
                type="outline"
                title="Sign Up"
                onPress={() => {
                  register()
                }}
              />
            </View>
          </View>
        </Card>
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

