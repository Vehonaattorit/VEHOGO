describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:19006')

    // Login
    // cy.get('[data-testid="vehologo"]').as('vehologo')
    // cy.get('[data-testid="emailInput"]').as('email')
    // cy.get('[data-testid="passwordInput"]').as('password')
    // cy.get('[data-testid="loginBtn"]').as('login')
    // cy.get('[data-testid="registerBtn"]').as('register')
    // [END]
  })

  it('loads the login page', {retries: 7}, () => {
    cy.get('[data-testid="vehologo"]')
    cy.get('[data-testid="emailInput"]')
    cy.get('[data-testid="passwordInput"]')
    cy.get('[data-testid="loginBtn"]')
    cy.get('[data-testid="registerBtn"]')
  })

  // it('login with passenger user', {retries: 7}, () => {
  //   cy.fixture('passengerSetup').then(({goodEmail, goodPassword}) => {
  //     cy.get('[data-testid="emailInput"]').type(goodEmail)
  //     cy.get('[data-testid="passwordInput"]').type(goodPassword)
  //     cy.get('[data-testid="loginBtn"]').click()

  //     cy.get('[role="button"][aria-label="Verify Email, back"]').click()

  //     cy.contains(/verify your email/i)

  //     cy.get('[data-testid="logout"]').click()
  //   })
  // })

  // // join company with join code

  // it('join company with join code', {retries: 7}, () => {
  //   cy.fixture('passengerSetup').then(({goodEmail, goodPassword}) => {
  //     cy.get('[data-testid="emailInput"]').type(goodEmail)
  //     cy.get('[data-testid="passwordInput"]').type(goodPassword)
  //     cy.get('[data-testid="loginBtn"]').click()

  //     cy.get('[data-testid="companyCodeInput"]').type('OEZtJo')
  //     cy.get('[data-testid="companyCodeAcceptBtn"]').click()

  //     cy.get('[data-testid="joinCompanyBtn"]').click()

  //     // Go back to login screen
  //     cy.get('[role="button"][aria-label="Join Company, back"]').click()

  //     cy.get('[role="button"][aria-label="Verify Email, back"]').click()

  //     cy.contains(/verify your email/i)

  //     cy.get('[data-testid="logout"]').click()

  //     // [END]
  //   })
  // })

  it(
    'continue with rest of setup: travel preference, home address, working days, working hours, ',
    {retries: 7},
    () => {
      cy.fixture('passengerSetup').then(({goodEmail, goodPassword}) => {
        cy.get('[data-testid="emailInput"]').type(goodEmail)
        cy.get('[data-testid="passwordInput"]').type(goodPassword)
        cy.get('[data-testid="loginBtn"]').click()
      })

      cy.get('[data-testid="companyCodeInput"]').type('OEZtJo')
      cy.get('[data-testid="companyCodeAcceptBtn"]').click()

      cy.get('[data-testid="joinCompanyBtn"]').click()

      // Travel Pref
      cy.get('[data-testid="getARideBtn"]').click()

      // Address
      cy.get('[data-testid="addressInput"]').clear()
      cy.get('[data-testid="addressInput"]').type('Siltakuja 2, Espoo')
      cy.get('[data-testid="addressSubmit"]').click()

      // Select work days

      cy.get('[data-testid="mondayID"]').click()
      cy.get('[data-testid="tuesdayID"]').click()
      cy.get('[data-testid="wednesdayID"]').click()
      cy.get('[data-testid="thursdayID"]').click()
      cy.get('[data-testid="fridayID"]').click()

      cy.get('[data-testid="workingDaysSubmitID"]').click()

      // workingDaysSubmitID
      // addressInput

      // cy.get('[data-testid="companyCodeAcceptBtn"]').click()

      // Go back to login screen
      // cy.get('[role="button"][aria-label="Join Company, back"]').click()

      // cy.get('[role="button"][aria-label="Verify Email, back"]').click()

      // cy.contains(/verify your email/i)

      // cy.get('[data-testid="logout"]').click()
    }
  )

  /**
   *       cy.get('[data-testid="companyCodeInput"]').type('OEZtJo')
      cy.get('[data-testid="companyCodeAcceptBtn"]').type('OEZtJo')

   */

  // navigate to register page

  // it('slide to register view', {retries: 7}, () => {
  //   cy.get('@register').click()
  // })

  // // input user with only email address
  // it('try to register user with only email address', {retries: 7}, () => {
  //   cy.get('@registerEmail').type('bad@test.com')

  //   cy.get('@registerNewUserBtn').click()

  //   cy.contains(/phone number must be/i)
  // })

  // // incorrectly formatted email address
  // it('try to register user with only email address', {retries: 7}, () => {
  //   cy.get('@registerEmail').type('badtest.com')

  //   cy.get('@registerNewUserBtn').click()

  //   cy.contains(/email must be email type/i)
  // })

  // // try to register new user with email, phone & fullname
  // it(
  //   'try to register new user with email, phone & fullname',
  //   {retries: 7},
  //   () => {
  //     cy.get('@registerEmail').type('bad@test.com')
  //     cy.get('@registerNumber').type('12345694448')
  //     cy.get('@registerFullname').type('Bad Test')

  //     cy.get('@registerNewUserBtn').click()

  //     cy.contains(/password must have 8 characters/i)
  //   }
  // )

  // it('try to register user with incorrect password', {retries: 7}, () => {
  //   cy.get('@registerEmail').type('test@register.com')
  //   cy.get('@registerNumber').type('123456789')
  //   cy.get('@registerFullname').type('Test Register')
  //   cy.get('@registerPassword').type('Test123')

  //   cy.get('@registerNewUserBtn').click()
  //   cy.contains(/password must have 8 characters/i)
  // })

  // it(
  //   'try to register user with incorrect password confirm',
  //   {retries: 7},
  //   () => {
  //     cy.get('@registerEmail').type('test@register.com')
  //     cy.get('@registerNumber').type('123456789')
  //     cy.get('@registerFullname').type('Test Register')
  //     cy.get('@registerPassword').type('Test123456')
  //     cy.get('@registerConfirmPassword').type('Test12345')

  //     cy.get('@registerNewUserBtn').click()
  //     cy.contains(/passwords do not match/i)
  //   }
  // )

  // it('register new user with correct field values', {retries: 7}, () => {
  //   cy.get('@registerEmail').type('test@register.com')
  //   cy.get('@registerNumber').type('123456789')
  //   cy.get('@registerFullname').type('Test Register')
  //   cy.get('@registerPassword').type('Test123456')
  //   cy.get('@registerConfirmPassword').type('Test123456')

  //   cy.get('@registerNewUserBtn').click()
  //   cy.contains(/verify your email from link/i)

  //   cy.get('[data-testid="logout"]').click()
  // })
})
