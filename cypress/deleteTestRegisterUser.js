var admin = require('firebase-admin')

var serviceAccount = require('../serviceAccount.json')

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
admin
  .auth()
  .getUserByEmail('test@register.com')
  .then(function (userRecord) {
    admin
      .auth()
      .deleteUser(userRecord.uid)
      .then(function () {
        console.log('Successfully deleted user')
        process.exit(0)
      })
      .catch(function (error) {
        console.log(error.code)
        process.exit(1)
      })
  })
  .catch(function (error) {
    console.log('Error fetching user data:', error)
    process.exit(1)
  })
