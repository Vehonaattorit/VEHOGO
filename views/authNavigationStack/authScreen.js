import React, {useRef} from 'react'
import {StyleSheet,ScrollView} from 'react-native'
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
