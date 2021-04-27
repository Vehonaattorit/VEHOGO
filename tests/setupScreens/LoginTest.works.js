import React from 'react'
import {LogIn} from '../../views/authNavigationStack/LogIn'

import {render, waitFor, fireEvent} from '@testing-library/react-native'

// login with error

it('Should throw an error when trying to log in', async () => {
  const {getByText, getByPlaceholderText, queryByText} = render(<LogIn />)

  // Write only email
  const emailInput = getByPlaceholderText('Email')
  const loginBtn = getByText('Login')

  // Press 'Login' button
  fireEvent.changeText(emailInput, 'driver01@test.com')
  fireEvent.press(loginBtn)

  await waitFor(() => {
    const errorMessage = getByText(
      'The password is invalid or the user does not have a password.'
    )

    expect(errorMessage).not.toBeNull()
  })
})

// login successfully

// display wrong password error message

// display wrong email error message
