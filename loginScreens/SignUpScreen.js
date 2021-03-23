import React from 'react'
import {StyleSheet} from 'react-native'
import {View, Item, Icon, Input, Text, Button} from 'native-base'
import {useState} from 'react'
import firebase from '../firebase/fire'


const SignUpScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)

  const signUp = async() => {
    console.log('trying to sign up')
    try {
      const result = firebase.auth().createUserWithEmailAndPassword(email, password)
      console.log('Registered')
    }catch(err){
      console.log('register failed' + err)
    }
  }

  const signIn = async() => {
    console.log('trying to sign up')
    try {
      const result = firebase.auth().signInWithEmailAndPassword(email, password)
      console.log('Login success')
    }catch(err){
      console.log('Log in failed' + err)
    }
  }


  return (

    <View style={styles.form}>

      {loginVisible ? (
        <>
      <Text>SignUp</Text>
      <Item floatingLabel>
      <Icon active name='person-outline' />
            <Input placeholder='Email'
            value = {email}
            onChangeText={setEmail}
            />
      </Item>
      <Item floatingLabel style={{marginTop: 20}}>
        <Icon active name='lock-closed-outline' />
            <Input placeholder='Password'
            value = {password}
            onChangeText={setPassword}
            />
      </Item>

      <Button onPress={() => signUp()} block style={styles.buttons} ><Text style={styles.txt}>Register</Text></Button>
      <Button onPress={() => setLoginVisible(!loginVisible)} block style={styles.buttons} ><Text style={styles.txt}>Already have an account?</Text></Button>
        </>
      ):(
        <>
      <Text>LogIn</Text>
      <Item floatingLabel>
      <Icon active name='person-outline' />
            <Input placeholder='Email'
            value = {email}
            onChangeText={setEmail}
            />
      </Item>
      <Item floatingLabel style={{marginTop: 20}}>
        <Icon active name='lock-closed-outline' />
            <Input placeholder='Password'
            value = {password}
            onChangeText={setPassword}
            />
      </Item>

      <Button onPress={() => signIn()} block style={styles.buttons} ><Text style={styles.txt}>Log In</Text></Button>
      <Button onPress={() => setLoginVisible(!loginVisible)} block style={styles.buttons} ><Text style={styles.txt}>No account yet?</Text></Button>
        </>
      )}

      </View>
  );
}

const styles = StyleSheet.create({
  txt: {
    color:'#000000'
  },
  buttons: {
    backgroundColor: '#26aae2',
    margin: 5
  },
  form: {
    margin: 5,
    marginTop: 60,
    alignSelf: 'stretch',
  }
});




export default SignUpScreen
