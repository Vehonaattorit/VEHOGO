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
          options={{title: 'Create or join '}}
        />
        <Stack.Screen
          name="Travel"
          component={Travel}
          options={{title: 'Travel'}}
        />
        <Stack.Screen
          name="Username"
          component={Username}
          options={{title: 'Username'}}
        />
        <Stack.Screen
          name="Address"
          component={Address}
          options={{title: 'Address'}}
        />
        <Stack.Screen
          name="WorkingDays"
          component={WorkingDays}
          options={{title: 'Working Days'}}
        />
        <Stack.Screen
          name="WorkingHours"
          component={WorkingHours}
          options={{title: 'Working Hours'}}
        />
        <Stack.Screen
          name="SetUpInit"
          component={SetUpInit}
          options={{title: 'Set Up Init'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default SetUpStackNavigator
