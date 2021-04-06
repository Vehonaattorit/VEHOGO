import React from 'react'
import renderer from 'react-test-renderer'

import TestComponent from './views/TestComponent'

describe('<TestComponent />', () => {
  it('should have 1 child', () => {
    const tree = renderer.create(<TestComponent />).toJSON()
    expect(tree.children.length).toBe(1)
  })
})
