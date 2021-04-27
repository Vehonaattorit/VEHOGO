describe('Login Page', () => {
  beforeEach(() => {
    // cy.visit('localhost:)

    cy.visit('http://192.168.1.3:19006')
  })

  it('loads the login page', () => {
    expect(true).to.equal(true)
  })
})
