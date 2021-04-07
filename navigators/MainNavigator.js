import React, {useContext} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {crea} from '@react-navigation/drawer'
import {MainPage} from '../views/MainPage'
import {OutlookCalendar} from '../views/OutlookCalendar'
import {DriverAcceptRefuse} from '../views/DriverAcceptRefuse'
import {NewRide} from '../views/NewRide'
import {DriverStartRide} from '../views/DriverStartRide'
import {DriverOnRoute} from '../views/DriverOnRoute'
import {Chat} from '../views/Chat'
import {DriverRideRequestList} from '../views/DriverRideRequestList'
import {DriverCarList} from '../views/DriverCarList'
import ChatRoom from '../views/ChatRoom'
import {UserContext} from '../contexts'
import {IconButton} from 'react-native-paper'
import {signOut} from '../controllers/LoginController'
import {color} from '../constants/colors'

const Stack = createStackNavigator()
const Drawer = createStackNavigator()
function MainStackNavigator() {
  const {user} = useContext(UserContext)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={() => ({
            title: 'Main Page',
            headerStyle: {
              backgroundColor: color.primaryLight,
            },
            headerTintColor: color.primary,
            headerLeft: () => (
              <IconButton
                icon="logout"
                size={28}
                color={color.primary}
                onPress={() => {
                  signOut()
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          name="OutlookCalendar"
          component={OutlookCalendar}
          options={{
            title: 'OutlookCalendar',
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
          name="DriverAcceptRefuse"
          component={DriverAcceptRefuse}
          options={{
            title: 'DriverAcceptRefuse',
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
          name="NewRide"
          component={NewRide}
          options={{
            title: 'NewRide',
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
          name="DriverStartRide"
          component={DriverStartRide}
          options={{
            title: 'DriverStartRide',
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
          name="DriverRideRequestList"
          component={DriverRideRequestList}
          options={{
            title: 'DriverRideRequestList',
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
          name="DriverOnRoute"
          component={DriverOnRoute}
          options={{
            title: 'DriverOnRoute',
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
          name="Chat Room"
          component={ChatRoom}
          options={{
            title: 'Chat',
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
          name="DriverCarList"
          component={DriverCarList}
          options={{
            title: 'DriverCarList',
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
          name="RequestRide"
          component={DriverAcceptRefuse}
          options={{
            title: 'Request Ride',
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

export default MainStackNavigator
