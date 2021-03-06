describe('Login Page', () => {
  beforeEach(() => {
    // cy.visit('localhost:)

    cy.visit('http://localhost:19006')
    cy.get('[data-testid="vehologo"]').as('vehologo')
    cy.get('[data-testid="emailInput"]').as('email')
    cy.get('[data-testid="passwordInput"]').as('password')

    cy.get('[data-testid="loginBtn"]').as('login')
    cy.get('[data-testid="registerBtn"]').as('register')
  })

  it('loads the login page', {retries: 7}, () => {
    cy.get('@vehologo')
    cy.get('@email')
    cy.get('@password')
    cy.get('@login')
    cy.get('@register')
  })

  it('display email error with empty input as required', () => {
    cy.get('@login').click()

    cy.contains(/email address/i)
  })

  // display error message when incorrect email
  it('display error message when incorrect email', () => {
    cy.get('@email').type('bad@actor.com')

    cy.get('@login').click()

    cy.contains(/password is invalid/i)
  })

  // display message with correct email & incorrect password

  it('display message with correct email & incorrect password', () => {
    cy.get('@email').type('test3@test.com')
    cy.get('@password').type('test123')

    cy.get('@login').click()

    cy.contains(/password is invalid/i)
  })

  it('logs in successfully', () => {
    cy.fixture('goodCredentials').then(({goodEmail, goodPassword}) => {
      cy.get('@email').type(goodEmail)
      cy.get('@password').type(goodPassword)
      cy.get('@login').click()

      cy.wait(6000)
      cy.contains(/create or join/i)

      //  Go back to login screen
      cy.get('[role="button"][aria-label="Verify Email, back"]').click()

      cy.wait(6000)
      cy.contains(/verify your email/i)

      cy.get('[data-testid="logout"]').click()
    })
  })
})
