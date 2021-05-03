import React, {useContext} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {MainPage} from '../views/MainPage'
import {OutlookCalendar} from '../views/OutlookCalendar'
import {DriverAcceptRefuse} from '../views/DriverAcceptRefuse'
import {NewRide} from '../views/NewRide'
import {DriverStartRide} from '../views/DriverStartRide'
import {DriverOnRoute} from '../views/DriverOnRoute'
import {DriverRideRequestList} from '../views/DriverRideRequestList'
import {DriverCarList} from '../views/DriverCarList'
import {ActiveRidesList} from '../views/ActiveRidesList'
import {Settings} from '../views/Settings'
import {MyRides} from '../views/MyRides'
import ChatRoom from '../views/ChatRoom'
import {UserContext} from '../contexts'
import {IconButton} from 'react-native-paper'
import {signOut} from '../controllers/LoginController'
import {color} from '../constants/colors'

import {Entypo} from '@expo/vector-icons'

import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import HeaderButton from '../components/CustomHeaderButton'
import CarEditForm from '../views/CarEditForm'

import PassengerPendingRequestsList from '../views/PassengerPendingRequestsList'

const Stack = createStackNavigator()
const Drawer = createStackNavigator()
const MainStackNavigator = ({linking}) => {
  const {user} = useContext(UserContext)

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: color.primaryLight,
          },
          headerTitleStyle: {
            fontFamily: 'open-sans-semi-bold',
            justifyContent: 'center',
            flex: 1,
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
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{title: 'Settings'}}
        />
        <Stack.Screen
          name="MyRides"
          component={MyRides}
          options={{title: 'My rides'}}
        />

        <Stack.Screen
          name="OutlookCalendar"
          component={OutlookCalendar}
          options={{
            title: 'Calendar',
          }}
        />
        <Stack.Screen
          name="DriverAcceptRefuse"
          component={DriverAcceptRefuse}
          options={{
            title: 'Request',
          }}
        />
        <Stack.Screen
          name="NewRide"
          component={NewRide}
          options={{
            title: 'Start Driving',
          }}
        />
        <Stack.Screen
          name="DriverStartRide"
          component={DriverStartRide}
          options={{
            title: 'Start Ride',
          }}
        />
        <Stack.Screen
          name="DriverRideRequestList"
          component={DriverRideRequestList}
          options={{
            title: 'Requests',
          }}
        />
        <Stack.Screen
          name="DriverOnRoute"
          component={DriverOnRoute}
          options={{
            title: 'Route',
          }}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          options={{
            title: 'Chat',
          }}
        />
        <Stack.Screen
          name="DriverCarList"
          component={DriverCarList}
          options={({navigation}) => ({
            title: 'Select Car',
            headerRight: () => (
              <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                  title="Menu"
                  iconComponent={Entypo}
                  iconName="new-message"
                  onPress={() => {
                    navigation.navigate('CarEditForm')
                  }}
                />
              </HeaderButtons>
            ),
          })}
        />
        <Stack.Screen
          name="ActiveRidesList"
          component={ActiveRidesList}
          options={({navigation}) => ({
            title: 'Drivers',
          })}
        />
        <Stack.Screen
          name="PassengerPendingRequestsList"
          component={PassengerPendingRequestsList}
          options={{
            title: 'Pending Requests',
          }}
        />
        <Stack.Screen name="CarEditForm" component={CarEditForm} />
        <Stack.Screen
          options={{
            title: 'Request Ride',
          }}
          name="RequestRide"
          component={DriverAcceptRefuse}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator
