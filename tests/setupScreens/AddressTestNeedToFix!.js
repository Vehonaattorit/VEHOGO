import React from 'react'
import {Address} from '../../views/Address'
import {SafeAreaView} from 'react-native'

import {render, act, waitFor, fireEvent} from '@testing-library/react-native'

import firebase from '../../firebase/fire'

import {getUser} from '../../controllers/userController'

import {registerForPushNotificationsAsync} from '../../controllers/LoginController'

import SetUpStackNavigator from '../../navigators/SetUpNavigator'
import {UserContext} from '../../contexts'

import {create} from 'react-test-renderer'
import {useDocumentData} from 'react-firebase-hooks/firestore'

describe('Address', () => {
  it('Create context', async () => {
    let newUser

    if (!firebase.apps.length) {
      await firebase.initializeApp(firebaseConfig)
    }

    await firebase
      .auth()
      .signInWithEmailAndPassword('test@test.com', 'Test123456')
      .then((user) => {
        registerForPushNotificationsAsync(user)
      })

    await firebase.auth().onAuthStateChanged((user) => {
      newUser = user
    })

    create(<UserContext.Provider value={{newUser}} />)
  })

  it('Should write and find an address', async () => {
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

    const {queryByText, getByText, getByPlaceholderText, getAllByText} = render(
      <UserContext.Provider value={{user}}>
        <Address />
      </UserContext.Provider>
    )

    // Get UI elements
    const addressInput = getByPlaceholderText('Search address ...')

    fireEvent.changeText(addressInput, 'Siltakuja 2')

    await act(async () => {
      const addressSuggestion = queryByText('Siltakuja 2')

      console.log('addressSuggestion', addressSuggestion)

      expect(addressSuggestion).not.toBeNull()
    })
  })
})

afterAll(async () => {
  firebase.firestore().terminate()

  console.log('afterAll 1.')
})
