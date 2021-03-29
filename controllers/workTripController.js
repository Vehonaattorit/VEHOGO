import firebase from 'firebase/app'
import {v4} from 'uuid/v4'
import {workTripConverter, WorkTrip} from '../models/workTrip'
import 'firebase/firestore'

const db = firebase.firestore()

export async function updateWorkTrip(companyId, workTrip) {
  try {
    if (workTrip.id == undefined) {
      workTrip.id = v4()
    }
    // Add a new document in collection "users"
    let workDayRef = db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .doc(workTrip.id)

    workDayRef.withConverter(workTripConverter).set(workTrip, {merge: true})
    return workTrip.id
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getWorkTrip(companyId, workTripId) {
  try {
    // Add a new document in collection "users"
    let doc = await db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .doc(workTripId)
      .withConverter(workTripConverter)
      .get()

    return doc.data()
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function getWorkTrips(companyId) {
  try {
    // Add a new document in collection "users"
    let snapShot = await db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .withConverter(workTripConverter)
      .get()
    const workTripList = []
    snapShot.forEach((doc) => {
      const data = doc.data()
      workTripList.push(workTripConverter.fromData(data))
    })
    return workTripList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export function workTripStream(companyId, workTripId) {
  try {
    // Add a new document in collection "users"
    let ref = db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .doc(workTripId)
      .withConverter(workTripConverter)

    return ref
  } catch (error) {
    console.error('Error getting document stream: ', error)
    return
  }
}

export async function workTripQuery(companyId, field, condition, value) {
  try {
    // Add a new document in collection "users"
    let querySnapshot = await db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .withConverter(workTripConverter)
      .where(field, condition, value)

    const workTripList = []
    querySnapshot.forEach((doc) => {
      workTripList.push(workTripConverter.fromData(doc))
    })
    return workTripList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}
