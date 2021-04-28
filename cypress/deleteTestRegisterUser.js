// var admin = require('firebase-admin')

var admin = require('firebase-admin')

var serviceAccount = require('../serviceAccount.json')

// import {serviceAccount} from '../newService'

console.log(serviceAccount)

// var serviceAccount = {
//   type,
//   project_id,
//   private_key_id,
//   private_key,
//   client_email,
//   client_id,
//   auth_uri,
//   token_uri,
//   auth_provider_x509_cert_url,
//   client_x509_cert_url,
// }

const app = admin.initializeApp({
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
      // clearFirebase.js
      .catch(function (error) {
        if (error.code === 'auth/user-not-found') process.exit(0)
        console.log('Error fetching user data:', error)
        process.exit(1)
      })
  })
  .catch(function (error) {
    console.log('Error fetching user data:', error)
    process.exit(1)
  })
