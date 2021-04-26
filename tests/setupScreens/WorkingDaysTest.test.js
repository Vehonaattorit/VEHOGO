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

describe('Address', () => {
  it('Select Mon - Fri', async () => {
    console.log('firebaseConfig', firebaseConfig)

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

    user = getUser(user.uid)

    const onPress = jest.fn()
    const navigate = jest.fn()
    const onSubmit = jest.fn()

    const {getByText, getByTestId} = render(
      <UserContext.Provider value={{user}}>
        <WorkingDays
          onSubmit={onSubmit}
          navigation={{navigate}}
          onPress={onPress}
        />
      </UserContext.Provider>
    )
    // [END]

    // Get UI elements
    const hintText = getByText(
      'Please enter the days you will be going to work'
    )

    const mondayBtn = getByText('Mon')
    // Mon - Fri
    fireEvent.press(getByTestId('mondayID'))
    fireEvent.press(getByTestId('tuesdayID'))
    fireEvent.press(getByTestId('wednesdayID'))
    fireEvent.press(getByTestId('thursdayID'))
    fireEvent.press(getByTestId('fridayID'))
    // [END]

    expect(onPress).toHaveBeenCalledTimes(5)

    expect(hintText).not.toBeNull()

    expect(onPress.mock.calls[0][0]).toEqual(
      {
        id: 1,
        testID: 'mondayID',
        weekDay: 'Mon',
        isSelected: false,
      },
      true
    )

    expect(onPress.mock.calls[1][0]).toEqual(
      {
        id: 2,
        testID: 'tuesdayID',
        weekDay: 'Tue',
        isSelected: false,
      },
      true
    )

    expect(onPress.mock.calls[2][0]).toEqual(
      {
        id: 3,
        testID: 'wednesdayID',
        weekDay: 'Wed',
        isSelected: false,
      },
      true
    )

    expect(onPress.mock.calls[3][0]).toEqual(
      {
        id: 4,
        testID: 'thursdayID',
        weekDay: 'Thu',
        isSelected: false,
      },
      true
    )

    expect(onPress.mock.calls[4][0]).toEqual(
      {
        id: 5,
        testID: 'fridayID',
        weekDay: 'Fri',
        isSelected: false,
      },
      true
    )

    const submitButton = getByTestId('submitID')

    expect(submitButton).not.toBeNull()

    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    expect(navigate).toHaveBeenCalledWith('WorkingHours')
  })

  it('Submit without selecting days', async () => {
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

    user = getUser(user.uid)

    const onPress = jest.fn()
    const navigate = jest.fn()

    const {
      queryByText,
      getByA11yState,
      getByText,
      getByTestId,
      getAllByText,
    } = render(
      <UserContext.Provider value={{user}}>
        <WorkingDays navigation={{navigate}} onPress={onPress} />
      </UserContext.Provider>
    )
    // [END]
    const submitBtn = getByTestId('submitID')

    fireEvent.press(submitBtn)

    // Alert error dialog is displayed
    expect(Alert.alert).not.toBeNull()
  })
})

afterAll(async () => {
  firebase.firestore().terminate()
})
