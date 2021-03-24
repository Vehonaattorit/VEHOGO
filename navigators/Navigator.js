import * as React from 'react'
import {Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {LogIn} from '../views/LogIn'
import {SignUp} from '../views/SignUp'
import {Travel} from '../views/Travel'
import {Address} from '../views/Address'
import {WorkingHours} from '../views/WorkingHours'
import {WorkingDays} from '../views/WorkingDays'
import {SetUpInit} from '../views/SetUpInit'
import {MainPage} from '../views/MainPage'
import {OutlookCalendar} from '../views/OutlookCalendar'
import {DriverAcceptRefuse} from '../views/DriverAcceptRefuse'
import {NewRide} from '../views/NewRide'
import {DriverStartRide} from '../views/DriverStartRide'
import {DriverOnRoute} from '../views/DriverOnRoute'
import {Chat} from '../views/Chat'
const Stack = createStackNavigator()
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
        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={{
            title: 'Main Page'
          }}
        />
        <Stack.Screen
          name="OutlookCalendar"
          component={OutlookCalendar}
          options={{
            title: 'OutlookCalendar'
          }}
        />
        <Stack.Screen
          name="DriverAcceptRefuse"
          component={DriverAcceptRefuse}
          options={{
            title: 'DriverAcceptRefuse'
          }}
        />
        <Stack.Screen
          name="NewRide"
          component={NewRide}
          options={{
            title: 'NewRide'
          }}
        />
        <Stack.Screen
          name="DriverStartRide"
          component={DriverStartRide}
          options={{
            title: 'DriverStartRide'
          }}
        />
        <Stack.Screen
          name="DriverOnRoute"
          component={DriverOnRoute}
          options={{
            title: 'DriverOnRoute'
          }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            title: 'Chat'
          }}
        />



      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator
