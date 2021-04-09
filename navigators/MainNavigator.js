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
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: color.primaryLight,
          },

          headerTitleStyle: {
            fontFamily: 'open-sans-semi-bold',
          },
          headerTintColor: color.primary,
        }}
      >
        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={() => ({
            title: '',
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
        />
        <Stack.Screen name="OutlookCalendar" component={OutlookCalendar} />
        <Stack.Screen
          name="DriverAcceptRefuse"
          component={DriverAcceptRefuse}
        />
        <Stack.Screen name="NewRide" component={NewRide} />
        <Stack.Screen name="DriverStartRide" component={DriverStartRide} />
        <Stack.Screen
          name="DriverRideRequestList"
          component={DriverRideRequestList}
        />
        <Stack.Screen name="DriverOnRoute" component={DriverOnRoute} />
        <Stack.Screen name="Chat Room" component={ChatRoom} />
        <Stack.Screen name="DriverCarList" component={DriverCarList} />
        <Stack.Screen name="RequestRide" component={DriverAcceptRefuse} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator
