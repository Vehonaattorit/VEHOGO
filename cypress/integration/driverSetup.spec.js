describe('Driver Setup', () => {
  beforeEach(() => {
    cy.visit('http://localhost:19006')
  })

  it('loads the login page', {retries: 7}, () => {
    cy.get('[data-testid="vehologo"]')
    cy.get('[data-testid="emailInput"]')
    cy.get('[data-testid="passwordInput"]')
    cy.get('[data-testid="loginBtn"]')
    cy.get('[data-testid="registerBtn"]')
  })

  it('login with driver user', {retries: 7}, () => {
    cy.fixture('driverSetup').then(({goodEmail, goodPassword}) => {
      cy.get('[data-testid="emailInput"]').type(goodEmail)
      cy.get('[data-testid="passwordInput"]').type(goodPassword)
      cy.get('[data-testid="loginBtn"]').click()

      cy.get('[role="button"][aria-label="Verify Email, back"]').click()

      cy.wait(10000)
      cy.contains(/verify your email/i)

      cy.get('[data-testid="logout"]').click()
    })
  })

  it('join company with join code', {retries: 7}, () => {
    cy.fixture('driverSetup').then(({goodEmail, goodPassword}) => {
      cy.get('[data-testid="emailInput"]').type(goodEmail)

      cy.wait(10000)

      cy.get('[data-testid="passwordInput"]').type(goodPassword)
      cy.get('[data-testid="loginBtn"]').click()

      cy.get('[data-testid="companyCodeInput"]').type('OEZtJo')
      cy.get('[data-testid="companyCodeAcceptBtn"]').click()

      cy.get('[data-testid="joinCompanyBtn"]').click()

      // Go back to login screen
      cy.get('[role="button"][aria-label="Join Company, back"]').click()

      cy.get('[role="button"][aria-label="Verify Email, back"]').click()

      cy.wait(10000)
      cy.contains(/verify your email/i)

      cy.get('[data-testid="logout"]').click()

      // [END]
    })
  })

  it(
    'continue with rest of setup: travel preference, home address, working days, working hours, ',
    {retries: 7},
    () => {
      cy.fixture('driverSetup').then(({goodEmail, goodPassword}) => {
        cy.get('[data-testid="emailInput"]').type(goodEmail)

        cy.wait(10000)
        cy.get('[data-testid="passwordInput"]').type(goodPassword)
        cy.get('[data-testid="loginBtn"]').click()
      })

      cy.get('[data-testid="companyCodeInput"]').type('OEZtJo')
      cy.get('[data-testid="companyCodeAcceptBtn"]').click()

      cy.get('[data-testid="joinCompanyBtn"]').click()

      // Travel Pref
      cy.get('[data-testid="shareMyCarBtn"]').click()

      // Address
      cy.get('[data-testid="addressInput"]').clear()
      cy.get('[data-testid="addressInput"]').type('Kirjanpitäjänkuja 4, Espoo')
      cy.get('[data-testid="addressSubmit"]').click()

      // Select work days
      cy.get('[data-testid="mondayID"]').click()

      cy.get('[data-testid="workingDaysSubmitID"]').click()

      // Select work times

      cy.get('[data-testid="workHoursStart"]').click()
      cy.get('[data-testid="workHoursEnd"]').click()
      cy.get('[data-testid="workHoursSubmit"]').click()

      cy.contains(/you are done/i)

      cy.get('[data-testid="finishSetupBtn"]').click()

      cy.contains(/available rides/i)
    }
  )
})
