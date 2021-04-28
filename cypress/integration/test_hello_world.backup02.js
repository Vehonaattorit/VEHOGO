describe('Some Test', () => {
  it('Adds document to test_hello_world collection of Firestore', () => {
    cy.callFirestore('add', 'test_hello_world', {some: 'value'})
  })

  it('Remove document from test_hello_world collection of Firestore', () => {
    cy.callRtdb('remove', 'test_hello_world')
  })

  it('Login to firebase with test UID', () => {
    cy.login('HYL1B9teNeheVD0cYspurLtqZhI2')
  })
})
