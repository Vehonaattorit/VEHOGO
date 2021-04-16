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
import {VerifyEmail} from '../views/VerifyEmail'
import {IconButton} from 'react-native-paper'
import {color} from '../constants/colors'
import {signOut} from '../controllers/LoginController'
import {Settings} from '../views/Settings'
const Stack = createStackNavigator()
function SetUpStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmail}
          options={() => ({
            title: 'Verify Email',
            headerTitleStyle: {
              fontSize: 30,
              textAlign: 'center',
              flex: 1,
            },
            headerTintColor: '#000000',
            headerLeft: () => (
              <IconButton
                icon="logout"
                size={28}
                color={color.darkBlue}
                onPress={() => {
                  signOut()
                }}
              />
            ),
          })}
          headerStyle={{
            backgroundColor: 'black',
          }}
        /> */}
        <Stack.Screen
          name="Company"
          component={Company}
          options={{
            title: 'Create or join',
            headerTitleStyle: {
              fontSize: 30,
              textAlign: 'center',
              flex: 1,
            },
            headerTintColor: '#000000',
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
            headerTitleStyle: {fontSize: 30, textAlign: 'center', flex: 1},
            headerTintColor: '#000000',
          }}
          headerStyle={{
            backgroundColor: 'black',
          }}
        />
        <Stack.Screen
          name="Address"
          component={Address}
          options={{
            headerTitleStyle: {
              fontSize: 30,
              textAlign: 'center',
              flex: 1,
            },
            headerTintColor: '#000000',
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
            headerTitleStyle: {textAlign: 'center', flex: 1, fontSize: 30},
            headerTintColor: '#000000',
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
            headerTitleStyle: {
              fontSize: 30,
              textAlign: 'center',
              flex: 1,
            },
            headerTintColor: '#000000',
          }}
          headerStyle={{
            backgroundColor: 'black',
          }}
        />
        <Stack.Screen name="SetUpInit" component={SetUpInit} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default SetUpStackNavigator
