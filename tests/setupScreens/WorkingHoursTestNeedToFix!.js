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
import {WorkingHours} from '../../views/WorkingHours'

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

jest.mock('@react-native-community/datetimepicker', function () {
  const mockComponent = require('react-native/jest/mockComponent')
  return mockComponent('@react-native-community/datetimepicker')
})

// //  I use expo v39, therefore I use `@react-native-community/datetimepicker`
// jest.mock('@react-native-community/datetimepicker', () => {
//   const React = require('React')
//   const RealComponent = jest.requireActual(
//     '@react-native-community/datetimepicker'
//   )

//   class Picker extends React.Component {
//     render() {
//       return React.createElement('Picker', this.props, this.props.children)
//     }
//   }

//   Picker.propTypes = RealComponent.propTypes
//   return Picker
// })

describe('Working Hours', () => {
  it('Select 7:30 as start work time', async () => {
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

    const startTime = jest.fn()
    const navigate = jest.fn()
    const endTime = jest.fn()

    const {getByText, findByA11yLabel, getByTestId} = render(
      <UserContext.Provider value={{user}}>
        <WorkingHours
          startTime={startTime}
          navigation={{navigate}}
          endTime={endTime}
        />
      </UserContext.Provider>
    )
    // [END]

    // Get start time button

    const startTimeBtn = getByTestId('startTimeID')

    const dateTimePicker = getByTestId('dateTimePickerID')

    const picker = findByA11yLabel('picker')
    fireEvent(picker, 'onChange', null, date)

    expect(picker.props.value).toEqual(new Date())

    // fireEvent.changeText(dateTimePicker, 'value', new Date(1970, 0, 1, 6, 30))

    // fireEvent(dateTimePicker, 'onConfirm')

    // set start time as 6:30

    // set end time as 15:30

    // // Get UI elements
    // const hintText = getByText(
    //   'Please enter the days you will be going to work'
    // )

    // const mondayBtn = getByText('Mon')
    // // Mon - Fri
    // fireEvent.press(getByTestId('mondayID'))
    // fireEvent.press(getByTestId('tuesdayID'))
    // fireEvent.press(getByTestId('wednesdayID'))
    // fireEvent.press(getByTestId('thursdayID'))
    // fireEvent.press(getByTestId('fridayID'))
    // // [END]

    // expect(onPress).toHaveBeenCalledTimes(5)

    // expect(hintText).not.toBeNull()

    // expect(onPress.mock.calls[0][0]).toEqual(
    //   {
    //     id: 1,
    //     testID: 'mondayID',
    //     weekDay: 'Mon',
    //     isSelected: false,
    //   },
    //   true
    // )

    // expect(onPress.mock.calls[1][0]).toEqual(
    //   {
    //     id: 2,
    //     testID: 'tuesdayID',
    //     weekDay: 'Tue',
    //     isSelected: false,
    //   },
    //   true
    // )

    // expect(onPress.mock.calls[2][0]).toEqual(
    //   {
    //     id: 3,
    //     testID: 'wednesdayID',
    //     weekDay: 'Wed',
    //     isSelected: false,
    //   },
    //   true
    // )

    // expect(onPress.mock.calls[3][0]).toEqual(
    //   {
    //     id: 4,
    //     testID: 'thursdayID',
    //     weekDay: 'Thu',
    //     isSelected: false,
    //   },
    //   true
    // )

    // expect(onPress.mock.calls[4][0]).toEqual(
    //   {
    //     id: 5,
    //     testID: 'fridayID',
    //     weekDay: 'Fri',
    //     isSelected: false,
    //   },
    //   true
    // )

    // const submitButton = getByTestId('submitID')

    // expect(submitButton).not.toBeNull()

    // fireEvent.press(submitButton)

    // await waitFor(() => {
    //   expect(onSubmit).toHaveBeenCalledTimes(1)
    // })

    // expect(navigate).toHaveBeenCalledWith('WorkingHours')
  })

  // it('Submit without selecting days', async () => {
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

  //   user = getUser(user.uid)

  //   const onPress = jest.fn()
  //   const navigate = jest.fn()

  //   const {
  //     queryByText,
  //     getByA11yState,
  //     getByText,
  //     getByTestId,
  //     getAllByText,
  //   } = render(
  //     <UserContext.Provider value={{user}}>
  //       <WorkingDays navigation={{navigate}} onPress={onPress} />
  //     </UserContext.Provider>
  //   )
  //   // [END]
  //   const submitBtn = getByTestId('submitID')

  //   fireEvent.press(submitBtn)

  //   // Alert error dialog is displayed
  //   expect(Alert.alert).not.toBeNull()
  // })
})

afterAll(async () => {
  firebase.firestore().terminate()
})
