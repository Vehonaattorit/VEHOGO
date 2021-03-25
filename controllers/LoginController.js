import firebase from '../firebase/fire'
import {updateUser} from '../controllers/userController'
import {User} from '../models/user'

export async function login(email, password, loginComplete){

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      console.log('Log In success')
      loginComplete()
    }catch(e){
      console.log('Login failed' + e)
    }

}

export async function register(email, password, registerComplete){

  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    console.log('Register success')
    registerComplete()
  }catch(e){
    console.log('Register failed' + e)
  }

}

export async function signOut(signedOut) {
  try {
    await firebase.auth().signOut()
    console.log('Logout success')
    signedOut()
  } catch(e) {
    console.log('Logout failed ' + e)
  }
}

export async function subscribeToAuth(authStateChanged){
  firebase.auth()
  .onAuthStateChanged((user) => {
    if(user != null){
      updateUser(new User({id: user.uid}))
    }
    authStateChanged(user)
  })
}
