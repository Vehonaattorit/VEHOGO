import {v4} from 'uuid/v4'
import firebase from 'firebase/app'
import {Car, carConverter} from '../models/car'
import 'firebase/firestore'
import {updateUser} from './userController'

const db = firebase.firestore()

export async function updateCar(userId, car) {
  try {
    if (car.id == undefined) {
      car.id = v4()
    }
    // Add a new document in collection "users"
    let userRef = db
      .collection('users')
      .doc(userId)
      .collection('cars')
      .doc(car.id)
    userRef.withConverter(carConverter).set(car, {merge: true})
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getCars(userId) {
  try {
    // Add a new document in collection "users"
    let userRef = db.collection('users').doc(userId).collection('cars')
    let snapShot = await userRef.withConverter(carConverter).get()
    const carList = []
    snapShot.forEach((doc) => {
      carList.push(
        new Car({
          id: doc.id,
          driverName: doc.data().driverName,
          registerNumber: doc.data().registerNumber,
          carName: doc.data().carName,
          availableSeats: doc.data().availableSeats,
        })
      )
    })
    return carList
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getCar(userId, carId) {
  try {
    // Add a new document in collection "users"
    let doc = await db
      .collection('users')
      .doc(userId)
      .collection('cars')
      .doc(carId)
      .withConverter(carConverter)
      .get()

    return doc.data()
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}
