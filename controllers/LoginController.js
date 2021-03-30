import firebase from '../firebase/fire'
import {updateUser} from '../controllers/userController'
import {User} from '../models/user'

export async function login(email, password) {
  try {
    console.log('Log In success')

    await firebase.auth().signInWithEmailAndPassword(email, password)
  } catch (e) {
    console.log('Login failed' + e.message)

    return e.message
  }
}

export async function register(email, password) {
  try {
    console.log('Register success')

    await firebase.auth().createUserWithEmailAndPassword(email, password)
  } catch (e) {
    console.log('Register failed' + e.message)
    return e.message
  }
}

export async function signOut(signedOut) {
  try {
    await firebase.auth().signOut()
    console.log('Logout success')
    signedOut()
  } catch (e) {
    console.log('Logout failed ' + e)
  }
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
