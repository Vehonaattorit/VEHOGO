import firebase from 'firebase/app'
import {userConverter} from '../models/user'
import 'firebase/firestore'

const db = firebase.firestore()

export async function updateUser(user) {
  try {
    // Add a new document in collection "users"
    let userRef = db.collection('users').doc(user.id)

    userRef.withConverter(userConverter).set(user, {merge: true})
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getUser(userId) {
  try {
    // Add a new document in collection "users"
    let doc = await db
      .collection('users')
      .doc(userId)
      .withConverter(userConverter)
      .get()

    return doc.data()
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}

export function userStream(userId) {
  try {
    // Add a new document in collection "users"
    let doc = db.collection('users').doc(userId)

    return doc
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}
