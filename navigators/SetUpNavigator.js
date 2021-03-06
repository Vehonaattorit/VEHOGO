import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {Travel} from '../views/Travel'
import {Address} from '../views/Address'
import {WorkingHours} from '../views/WorkingHours'
import {WorkingDays} from '../views/WorkingDays'
import {Username} from '../views/Username'
import {SetUpInit} from '../views/SetUpInit'
import {Company} from '../views/Company'
import {color} from '../constants/colors'
import {VerifyEmail} from '../views/VerifyEmail'
import {IconButton} from 'react-native-paper'
import {signOut} from '../controllers/LoginController'
import CarSetup from '../views/CarSetup'
const Stack = createStackNavigator()
function SetUpStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: color.primaryLight,
          },
          headerTitleStyle: {
            fontFamily: 'open-sans-semi-bold',
            justifyContent: 'center',
          },
          headerTintColor: color.primary,
        }}
      >
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmail}
          options={() => ({
            title: 'Verify Email',
            headerLeft: () => (
              <IconButton
                testID="logout"
                icon="logout"
                size={28}
                color={color.darkBlue}
                onPress={() => {
                  signOut()
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Company"
          component={Company}
          options={{
            title: 'Create Or Join',
          }}
        />
        <Stack.Screen
          name="Travel"
          component={Travel}
          options={{
            title: 'Travel',
          }}
        />
        <Stack.Screen
          name="Address"
          component={Address}
          options={{
            title: 'Home Address',
          }}
        />
        <Stack.Screen
          name="Username"
          component={Username}
          options={{
            title: 'Username',
          }}
        />
        <Stack.Screen
          name="WorkingDays"
          component={WorkingDays}
          options={{
            title: 'Working Days',
          }}
        />
        <Stack.Screen
          name="WorkingHours"
          component={WorkingHours}
          options={{
            title: 'Working Hours',
          }}
        />
        <Stack.Screen
          name="CarSetup"
          component={CarSetup}
          options={{
            title: 'Your Car',
          }}
        />
        <Stack.Screen
          options={{
            title: '',
          }}
          name="SetUpInit"
          component={SetUpInit}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default SetUpStackNavigator
