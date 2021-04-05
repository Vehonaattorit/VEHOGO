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
          options={{
            title: 'Login',
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTitleStyle: {textAlign: 'center', flex: 1},
            headerTintColor: '#ffffff',
          }}
          headerStyle={{
            backgroundColor: 'black',
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            title: 'Register',
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTitleStyle: {textAlign: 'center', flex: 1},
            headerTintColor: '#ffffff',
          }}
          headerStyle={{
            backgroundColor: 'black',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthStackNavigator
