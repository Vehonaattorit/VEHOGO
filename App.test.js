import React from 'react'
import renderer from 'react-test-renderer'

import TestComponent from './TestComponent'

describe('<TestComponent />', () => {
  it('has 1 child', () => {
    const tree = renderer.create(<TestComponent />).toJSON()
    expect(tree.children.length).toBe(1)
  })
})
