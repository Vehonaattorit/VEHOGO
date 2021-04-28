// import firebase from '../../firebase/fire'

// import {getUser} from '../../controllers/userController'

describe('Register Page', () => {
  beforeEach(() => {
    // cy.visit('localhost:)

    cy.visit('http://localhost:19006')

    // Login
    cy.get('[data-testid="vehologo"]').as('vehologo')
    cy.get('[data-testid="emailInput"]').as('email')
    cy.get('[data-testid="passwordInput"]').as('password')
    cy.get('[data-testid="loginBtn"]').as('login')
    cy.get('[data-testid="registerBtn"]').as('register')
    // [END]

    // Register
    cy.get('[data-testid="registerEmail"]').as('registerEmail')
    cy.get('[data-testid="registerNumber"]').as('registerNumber')
    cy.get('[data-testid="registerFullname"]').as('registerFullname')
    cy.get('[data-testid="registerPassword"]').as('registerPassword')
    cy.get('[data-testid="registerConfirmPassword"]').as(
      'registerConfirmPassword'
    )
    cy.get('[data-testid="registerNewUserBtn"]').as('registerNewUserBtn')
  })

  it('loads the login page', {retries: 7}, () => {
    cy.get('@vehologo')
    cy.get('@email')
    cy.get('@password')
    cy.get('@login')
    cy.get('@register')
  })

  // navigate to register page

  it('slide to register view', {retries: 7}, () => {
    cy.get('@register').click()
  })

  // input user with only email address
  it('try to register user with only email address', {retries: 7}, () => {
    cy.get('@registerEmail').type('bad@test.com')

    cy.get('@registerNewUserBtn').click()

    cy.contains(/phone number must be/i)
  })

  // incorrectly formatted email address
  it('try to register user with only email address', {retries: 7}, () => {
    cy.get('@registerEmail').type('badtest.com')

    cy.get('@registerNewUserBtn').click()

    cy.contains(/email must be email type/i)
  })

  // try to register new user with email, phone & fullname
  it(
    'try to register new user with email, phone & fullname',
    {retries: 7},
    () => {
      cy.get('@registerEmail').type('bad@test.com')
      cy.get('@registerNumber').type('12345694448')
      cy.get('@registerFullname').type('Bad Test')

      cy.get('@registerNewUserBtn').click()

      cy.contains(/password must have 8 characters/i)
    }
  )

  it('try to register user with incorrect password', {retries: 7}, () => {
    cy.get('@registerEmail').type('test@register.com')
    cy.get('@registerNumber').type('123456789')
    cy.get('@registerFullname').type('Test Register')
    cy.get('@registerPassword').type('Test123')

    cy.get('@registerNewUserBtn').click()
    cy.contains(/password must have 8 characters/i)
  })

  it(
    'try to register user with incorrect password confirm',
    {retries: 7},
    () => {
      cy.get('@registerEmail').type('test@register.com')
      cy.get('@registerNumber').type('123456789')
      cy.get('@registerFullname').type('Test Register')
      cy.get('@registerPassword').type('Test123456')
      cy.get('@registerConfirmPassword').type('Test12345')

      cy.get('@registerNewUserBtn').click()
      cy.contains(/passwords do not match/i)
    }
  )

  it('register new user with correct field values', {retries: 7}, () => {
    // Delete user with email name
    // const userList = await getUserByEmail('test@register.com')

    // for (const user of userList) {
    //   deleteUser(user.id)
    // }
    // [END]

    cy.get('@registerEmail').type('test@register.com')
    cy.get('@registerNumber').type('123456789')
    cy.get('@registerFullname').type('Test Register')
    cy.get('@registerPassword').type('Test123456')
    cy.get('@registerConfirmPassword').type('Test123456')

    cy.get('@registerNewUserBtn').click()

    cy.wait(10000)
    cy.contains(/verify your email from link/i)

    cy.get('[data-testid="logout"]').click()
  })

  it('Delete created test@register.com user from firebase', () => {
    cy.exec('node ./cypress/deleteTestRegisterUser.js', {
      // user.email comes from a fixture file but you can use a simple string as well
      env: {email: "test@register.com'"},
    }).then((result) => {
      //Just for debugging
      console.log('code-232', result.code)
      console.log('stderr-232', result.stderr)
      console.log('stdout-232', result.stdout)
    })
  })
})
