import React from 'react'
import {SignUp} from '../views/SignUp'

import {render, waitFor, fireEvent} from '@testing-library/react-native'

// SignUp with error

it('Should throw an error when trying to log in', async () => {
  const {getByText, getByPlaceholderText} = render(<SignUp />)

  // Write only email
  const emailInput = getByPlaceholderText('email@address.com')
  const registerBtn = getByText('Register')

  // Press 'SignUp' button
  fireEvent.changeText(emailInput, 'driver01@test.com')
  fireEvent.press(registerBtn)

  await waitFor(() => {
    const errorMessage = getByText(
      'The password must be 6 characters long or more.'
    )

    expect(errorMessage).not.toBeNull()
  })
})

// register successfully

// display wrong password error message

// display wrong email error message
