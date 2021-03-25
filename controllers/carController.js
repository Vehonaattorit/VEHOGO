import firebase from 'firebase/app'
import {carConverter} from '../models/car'
import 'firebase/firestore'

export async function createCar(userId, car) {
  try {
    // Add a new document in collection "users"
    let userRef = db.collection('users').doc(userId).collection('cars')

    userRef.withConverter(carConverter).add(car)
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}
