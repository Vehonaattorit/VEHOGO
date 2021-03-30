import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {LogIn} from '../views/LogIn'
import {SignUp} from '../views/SignUp'
const Stack = createStackNavigator()
function AuthStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{title: 'Log In'}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{title: 'Sign Up'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthStackNavigator
