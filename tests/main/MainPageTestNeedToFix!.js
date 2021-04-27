import React from 'react'
import {WorkingDays} from '../../views/WorkingDays'
import {SafeAreaView} from 'react-native'

import {render, act, waitFor, fireEvent} from '@testing-library/react-native'

import firebase from '../../firebase/fire'

import {getUser} from '../../controllers/userController'

import {registerForPushNotificationsAsync} from '../../controllers/LoginController'

import SetUpStackNavigator from '../../navigators/SetUpNavigator'
import {UserContext} from '../../contexts'

import {create} from 'react-test-renderer'
import {useDocumentData} from 'react-firebase-hooks/firestore'
import {Alert} from 'react-native'

import {firebaseConfig} from '../../secrets/secrets'
import {MainPage} from '../../views/MainPage'

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')

  return Object.setPrototypeOf(
    {
      Alert: {
        ...RN.Alert,
        alert: jest.fn(),
      },
    },
    RN
  )
})

describe('Main Page Tests', () => {
  it('Calendar navigation', async () => {
    // Test user
    let user
    if (!firebase.apps.length) {
      await firebase.initializeApp(firebaseConfig)
    }

    await firebase
      .auth()
      .signInWithEmailAndPassword('test@test.com', 'Test123456')
      .then((user) => {
        registerForPushNotificationsAsync(user)
      })

    await firebase.auth().onAuthStateChanged((newUser) => {
      user = newUser
    })

    user = await getUser(user.uid)

    const navigate = jest.fn()
    const setOptions = jest.fn()

    const {getByText, getByTestId} = render(
      <UserContext.Provider value={{user}}>
        <MainPage navigation={{navigate, setOptions}} />
      </UserContext.Provider>
    )
    // [END]

    // Find UI elements
    const calendarBtn = getByTestId('calendarID')

    fireEvent.press(calendarBtn)
    expect(navigate).toHaveBeenCalledWith('OutlookCalendar')
  })
  it('Settings navigation', async () => {
    // Test user
    let user
    if (!firebase.apps.length) {
      await firebase.initializeApp(firebaseConfig)
    }

    await firebase
      .auth()
      .signInWithEmailAndPassword('test@test.com', 'Test123456')
      .then((user) => {
        registerForPushNotificationsAsync(user)
      })

    await firebase.auth().onAuthStateChanged((newUser) => {
      user = newUser
    })

    user = await getUser(user.uid)

    const navigate = jest.fn()
    const setOptions = jest.fn()

    const {getByText, getByTestId} = render(
      <UserContext.Provider value={{user}}>
        <MainPage navigation={{navigate, setOptions}} />
      </UserContext.Provider>
    )
    // [END]

    // Find UI elements
    const accountSettings = getByTestId('accountSettingsID')

    fireEvent.press(accountSettings)
    expect(navigate).toHaveBeenCalledWith('Settings')
  })

  // it('My Rides navigation', async () => {
  //   // Test user
  //   let user
  //   if (!firebase.apps.length) {
  //     await firebase.initializeApp(firebaseConfig)
  //   }

  //   await firebase
  //     .auth()
  //     .signInWithEmailAndPassword('test@test.com', 'Test123456')
  //     .then((user) => {
  //       registerForPushNotificationsAsync(user)
  //     })

  //   await firebase.auth().onAuthStateChanged((newUser) => {
  //     user = newUser
  //   })

  //   user = await getUser(user.uid)

  //   const navigate = jest.fn()

  //   const {getByText, getByTestId} = render(
  //     <UserContext.Provider value={{user}}>
  //       <MainPage navigation={{navigate}} />
  //     </UserContext.Provider>
  //   )
  //   // [END]

  //   // Find UI elements
  //   const calendarBtn = getByTestId('calendarID')

  //   fireEvent.press(calendarBtn)
  //   expect(navigate).toHaveBeenCalledWith('OutlookCalendar')
  // })
  // it('Log out navigation', async () => {
  //   // Test user
  //   let user
  //   if (!firebase.apps.length) {
  //     await firebase.initializeApp(firebaseConfig)
  //   }

  //   await firebase
  //     .auth()
  //     .signInWithEmailAndPassword('test@test.com', 'Test123456')
  //     .then((user) => {
  //       registerForPushNotificationsAsync(user)
  //     })

  //   await firebase.auth().onAuthStateChanged((newUser) => {
  //     user = newUser
  //   })

  //   user = await getUser(user.uid)

  //   const navigate = jest.fn()

  //   const {getByText, getByTestId} = render(
  //     <UserContext.Provider value={{user}}>
  //       <MainPage navigation={{navigate}} />
  //     </UserContext.Provider>
  //   )
  //   // [END]

  //   // Find UI elements
  //   const calendarBtn = getByTestId('calendarID')

  //   fireEvent.press(calendarBtn)
  //   expect(navigate).toHaveBeenCalledWith('OutlookCalendar')
  // })
  // it('Driver trip list item navigation', async () => {
  //   // Test user
  //   let user
  //   if (!firebase.apps.length) {
  //     await firebase.initializeApp(firebaseConfig)
  //   }

  //   await firebase
  //     .auth()
  //     .signInWithEmailAndPassword('test@test.com', 'Test123456')
  //     .then((user) => {
  //       registerForPushNotificationsAsync(user)
  //     })

  //   await firebase.auth().onAuthStateChanged((newUser) => {
  //     user = newUser
  //   })

  //   user = await getUser(user.uid)

  //   const navigate = jest.fn()

  //   const {getByText, getByTestId} = render(
  //     <UserContext.Provider value={{user}}>
  //       <MainPage navigation={{navigate}} />
  //     </UserContext.Provider>
  //   )
  //   // [END]

  //   // Find UI elements
  //   const calendarBtn = getByTestId('calendarID')

  //   fireEvent.press(calendarBtn)
  //   expect(navigate).toHaveBeenCalledWith('OutlookCalendar')
  // })
})

afterAll(async () => {
  firebase.firestore().terminate()
})
