import firebase from 'firebase/app'
import {userConverter} from '../models/user'
import 'firebase/firestore'

const db = firebase.firestore()

export async function updateUser(user) {
  try {
    // Add a new document in collection "users"
    let userRef = db.collection('users').doc(user.id)

    await userRef.withConverter(userConverter).set(user, {merge: true})
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function softUpdateUser(user) {
  try {
    // Add a new document in collection "users"
    let userRef = db.collection('users').doc(user.id)
    let userObject = userConverter.toFirestore(user)
    await userRef.withConverter(userConverter).update(userObject)
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function userDocumentUpdater(user) {
  try {
    // Add a new document in collection "users"
    let userRef = db.collection('users').doc(user.id)
    await userRef.withConverter(userConverter).update(user)
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getUser(user) {
  try {
    // Add a new document in collection "users"
    let doc = await db
      .collection('users')
      .doc(user)
      .withConverter(userConverter)
      .get()

    return doc.data()
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}

export async function deleteUser(userId) {
  try {
    db.collection('users')
      .doc(userId)
      .delete()
      .then(() => {
        console.log('User successfully deleted!')
      })
  } catch (error) {
    console.error('Error removing document: ', error)
  }
}

export function userStream(userId) {
  try {
    // Add a new document in collection "users"
    let doc = db.collection('users').doc(userId).withConverter(userConverter)

    return doc
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}
