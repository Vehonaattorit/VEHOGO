import React from 'react'
import {SignUp} from '../views/authNavigationStack/SignUp'

import {render, waitFor, fireEvent} from '@testing-library/react-native'

// SignUp with error

it('Should throw an error when trying to log in', async () => {
  const {getByText, getAllByText, getByPlaceholderText} = render(<SignUp />)

  // Write only email
  const emailInput = getByPlaceholderText('Email')
  const registerBtn = getByText('Register')

  // Press 'SignUp' button
  fireEvent.changeText(emailInput, 'driver01@test.com')
  fireEvent.press(registerBtn)

  await waitFor(() => {
    const errorMessage = getAllByText(
      'Name and Phone number must be at least 1 char long'
    )

    expect(errorMessage[0]).not.toBeNull()
  })
})

// register successfully

// display wrong password error message

// display wrong email error message
