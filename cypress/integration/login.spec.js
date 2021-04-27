describe('Login Page', () => {
  beforeEach(() => {
    // cy.visit('localhost:)

    cy.visit('http://localhost:19006')
  })

  it('loads the login page', {retries: 7}, () => {
    expect(true).to.equal(true)

    cy.get('img')
    // cy.contains('perkule')
  })
})
