import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {AuthScreen} from '../views/authNavigationStack/authScreen'
const Stack = createStackNavigator()
function AuthStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Sign in"
          component={AuthScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthStackNavigator
