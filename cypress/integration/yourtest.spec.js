describe('Some Test', () => {
  it('Adds document to test_hello_world collection of Firestore', () => {
    cy.exec('node ./cypress/deleteTestRegisterUser.js', {
      // user.email comes from a fixture file but you can use a simple string as well
      env: {email: "test@register.com'"},
    }).then((result) => {
      //Just for debugging
      console.log(result.code)
      console.log(result.stderr)
      console.log(result.stdout)
    })
  })
})
