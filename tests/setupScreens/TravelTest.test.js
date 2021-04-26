import React from 'react'
import {Travel} from '../../views/Travel'

import {render, waitFor, fireEvent} from '@testing-library/react-native'

it("Choosing 'Share My Car' button takes user to Address setup screen", async () => {
  const navigate = jest.fn()

  const {getByText} = render(<Travel navigation={{navigate}} />)

  // Find UI elements
  const shareCarBtn = getByText('Share My Car')

  // Press 'Share My Car' button

  fireEvent.press(shareCarBtn)
  expect(navigate).toHaveBeenCalledWith('Address')
})

it("Choosing 'Get A Ride' button takes user to Address setup screen", async () => {
  const navigate = jest.fn()

  const {getByText} = render(<Travel navigation={{navigate}} />)

  // Find UI elements
  const shareCarBtn = getByText('Get A Ride')

  // Press 'Share My Car' button

  fireEvent.press(shareCarBtn)
  expect(navigate).toHaveBeenCalledWith('Address')
})
