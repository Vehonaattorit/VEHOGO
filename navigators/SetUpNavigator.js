import React, {useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {Travel} from '../views/Travel'
import {Address} from '../views/Address'
import {WorkingHours} from '../views/WorkingHours'
import {WorkingDays} from '../views/WorkingDays'
import {Username} from '../views/Username'
import {SetUpInit} from '../views/SetUpInit'
import {Company} from '../views/Company'

const Stack = createStackNavigator()
function SetUpStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Company"
          component={Company}
          options={{
            title: 'Create or join',
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
          name="Travel"
          component={Travel}
          options={{
            title: 'Travel',
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
          name="Username"
          component={Username}
          options={{
            title: 'Username',
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
          name="Address"
          component={Address}
          options={{
            title: 'Address',
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
          name="WorkingDays"
          component={WorkingDays}
          options={{
            title: 'Working Days',
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
          name="WorkingHours"
          component={WorkingHours}
          options={{
            title: 'Working Hours',
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
          name="SetUpInit"
          component={SetUpInit}
          options={{
            title: 'Set Up Init',
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

export default SetUpStackNavigator
