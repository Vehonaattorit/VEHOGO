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
import {DriverCarList} from '../views/DriverCarList'
import ChatRoom from '../views/ChatRoom'
import {UserContext} from '../contexts'
const Stack = createStackNavigator()
const Drawer = createStackNavigator()
function MainStackNavigator() {
  const {user} = useContext(UserContext)

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={{
            title: 'Main Page',
          }}
        />
        <Stack.Screen
          name="OutlookCalendar"
          component={OutlookCalendar}
          options={{
            title: 'OutlookCalendar',
          }}
        />
        <Stack.Screen
          name="DriverAcceptRefuse"
          component={DriverAcceptRefuse}
          options={{
            title: 'DriverAcceptRefuse',
          }}
        />
        <Stack.Screen
          name="NewRide"
          component={NewRide}
          options={{
            title: 'NewRide',
          }}
        />
        <Stack.Screen
          name="DriverStartRide"
          component={DriverStartRide}
          options={{
            title: 'DriverStartRide',
          }}
        />
        <Stack.Screen
          name="DriverOnRoute"
          component={DriverOnRoute}
          options={{
            title: 'DriverOnRoute',
          }}
        />
        <Stack.Screen
          name="Chat Room"
          component={ChatRoom}
          options={{
            title: 'Chat',
          }}
        />
        <Stack.Screen
          name="DriverCarList"
          component={DriverCarList}
          options={{
            title: 'DriverCarList',
          }}
        />
        <Stack.Screen
          name="RequestRide"
          component={DriverAcceptRefuse}
          options={{
            title: 'Request Ride',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator
