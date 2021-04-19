import firebase from '../firebase/fire'
import {updateUser} from '../controllers/userController'
import {User} from '../models/user'

export async function login(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password)
}

export async function register(email, password) {
  try {
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
      update(user.uid)
      //await updateUser(new User({id: user.uid}))
    }
    authStateChanged(user)
  })
}

const update = async (id) => {
  await updateUser(new User({id: id}))
}

export async function checkEmailVerification() {
  try {
    const response = firebase.auth().currentUser.emailVerified
    return response
  } catch (e) {
    return e.message
  }
}
