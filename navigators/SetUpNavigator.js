import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {Travel} from '../views/Travel'
import {Address} from '../views/Address'
import {WorkingHours} from '../views/WorkingHours'
import {WorkingDays} from '../views/WorkingDays'
import {SetUpInit} from '../views/SetUpInit'
import {CreateCompany} from '../views/CreateCompany'

const Stack = createStackNavigator()
function SetUpStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="CreateCompany"
          component={CreateCompany}
          options={{title: 'Create A Company'}}
        />
        <Stack.Screen
          name="Travel"
          component={Travel}
          options={{title: 'Travel'}}
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
