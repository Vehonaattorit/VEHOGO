import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {LogIn} from '../views/LogIn';
import {SignUp} from '../views/SignUp';
import {Travel} from '../Views/Travel';
import {Address} from '../Views/Address';
import {WorkingHours} from '../Views/WorkingHours';
import {WorkingDays} from '../Views/WorkingDays';
import {SetUpInit} from '../Views/SetUpInit';

const Stack = createStackNavigator();
function MainStackNavigator() {
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
          options={{title: 'Log In'}}
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
          name="WorkingHours"
          component={WorkingHours}
          options={{title: 'Working Hours'}}
        />
        <Stack.Screen
          name="WorkingDays"
          component={WorkingDays}
          options={{title: 'Working Days'}}
        />
        <Stack.Screen
          name="setUpInit"
          component={SetUpInit}
          options={{title: 'Set Up Init'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStackNavigator;