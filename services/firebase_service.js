async function updateUser(user) {
  try {
    if (user.id == undefined) {
      throw new Error('user id not defined')
    }
    // Add a new document in collection "users"
    let userRef = db.collection('users').doc(user.id)

    userRef.withConverter(userConverter).set(user, {merge: true})
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

async function createCar(userId, car) {
  try {
    if (userId == undefined) {
      throw new Error('userId id not defined')
    }
    // Add a new document in collection "users"
    let userRef = db.collection('users').doc(userId).collection('cars')

    userRef.withConverter(userConverter).add(car)
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}
