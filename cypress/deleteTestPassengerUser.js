var admin = require('firebase-admin')

var serviceAccount = require('../serviceAccount.json')

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

admin
  .auth()
  .getUserByEmail('test.vehoshareride.passenger@gmail.com')
  .then(function (userRecord) {
    // admin.firestore.Query.

    admin
      .auth()
      .deleteUser(userRecord.uid)
      .then(function () {
        console.log(userRecord.uid)

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
