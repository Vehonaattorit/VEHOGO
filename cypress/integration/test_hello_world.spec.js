describe('Some Test', () => {
  it('Adds document to test_hello_world collection of Firestore', () => {
    cy.callFirestore('add', 'test_hello_world', {some: 'value'})
  })

  it('Login to firebase with test UID', () => {
    cy.login('HYL1B9teNeheVD0cYspurLtqZhI2')
  })
})
