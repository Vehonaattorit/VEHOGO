import React from 'react'
import {Travel} from '../views/Travel'

import {render, waitFor, fireEvent} from '@testing-library/react-native'

it('Should choose Share My Car button', async () => {
  const {getByText} = render(<Travel />)

  // Find UI elements
  const shareCarBtn = getByText('Share My Car')

  // Press 'Share My Car' button
  fireEvent.press(shareCarBtn)
})
