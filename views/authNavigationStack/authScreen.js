import React, {useEffect, useRef} from 'react'
import {useState} from 'react'
import {StyleSheet, View, Button, FlatList, ScrollView} from 'react-native'
import {color} from '../../constants/colors'
import {Input} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from '../../firebase/fire'
import {CustomButton} from '../../components/CustomButton'
import {AuthButtons} from '../../components/AuthButton'
import {CustomTitle} from '../../components/CustomTitle'
import {login, subscribeToAuth} from '../../controllers/LoginController'
import {LogIn} from './LogIn'
import {SignUp} from './SignUp'

export const AuthScreen = ({navigation}) => {
  const scrollRef = useRef()

  return (
    <ScrollView
      ref={scrollRef}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={200}
      decelerationRate="fast"
      pagingEnabled
    >
      <LogIn scrollRef={scrollRef} />
      <SignUp />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    backgroundColor: 'black',
    borderRadius: 10,
  },
  logInBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
})
