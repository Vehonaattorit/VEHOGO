import firebase from '../firebase/fire'
import {updateUser} from '../controllers/userController'
import {User} from '../models/user'

export async function login(email, password) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password)
  } catch (e) {
    return e.message
  }
}

export async function register(email, password) {
  try {
    console.log('Register success')

    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
    await response.user.sendEmailVerification()
    return response
  } catch (e) {
    return e.message
  }
}

export async function signOut() {
  try {
    await firebase.auth().signOut()
  } catch (e) {}
}

export async function subscribeToAuth(authStateChanged) {
  if (!firebase.apps.length) {
    await firebase.initializeApp(firebaseConfig)
  }
  firebase.auth().onAuthStateChanged((user) => {
    if (user != null) {
      updateUser(new User({id: user.uid}))
    }
    authStateChanged(user)
  })
}

export async function checkEmailVerification() {
  try {
    const response = await firebase.auth().currentUser.emailVerified
    return response
  } catch (e) {
    console.log('Verification failed' + e.message)
    return e.message
  }
}
