import firebase from 'firebase/app'
import {v4} from 'uuid/v4'
import {rideRequestConverter, RideRequest} from '../models/rideRequest'
import 'firebase/firestore'

const db = firebase.firestore()

export async function updateRideRequest(companyId, rideRequest) {
  try {
    if (rideRequest.id == undefined) {
      rideRequest.id = v4()
    }
    // Add a new document in collection "users"
    let rideRequestRef = db
      .collection('companys')
      .doc(companyId)
      .collection('requests')
      .doc(rideRequest.id)

    rideRequestRef
      .withConverter(rideRequestConverter)
      .set(rideRequest, {merge: true})
    return rideRequest.id
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getRideRequest(companyId, rideRequestId) {
  try {
    // Add a new document in collection "users"
    let doc = await db
      .collection('companys')
      .doc(companyId)
      .collection('requests')
      .doc(rideRequestId)
      .withConverter(rideRequestConverter)
      .get()

    return doc.data()
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function deleteRideRequest(companyId, rideRequestId) {
  try {
    // Add a new document in collection "users"
    let doc = await db
      .collection('companys')
      .doc(companyId)
      .collection('requests')
      .doc(rideRequestId)
      .delete()

    return true
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function getRideRequests(companyId) {
  try {
    // Add a new document in collection "users"
    let snapShot = await db
      .collection('companys')
      .doc(companyId)
      .collection('requests')
      .withConverter(rideRequestConverter)
      .get()
    const rideRequestList = []
    snapShot.forEach((doc) => {
      const data = doc.data()

      rideRequestList.push(rideRequestConverter.fromData(data))
    })
    return rideRequestList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function rideRequestQuery(companyId, field, condition, value) {
  try {
    // Add a new document in collection "users"
    let ref = await db
      .collection('companys')
      .doc(companyId)
      .collection('requests')
      .withConverter(rideRequestConverter)
      .where(field, condition, value)
      .get()

    const workTripList = []
    ref.forEach((doc) => {
      workTripList.push(rideRequestConverter.fromData(doc.data()))
    })

    return workTripList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

// export async function rideRequestQuery(companyId, field, condition, value) {
//   try {
//     // Add a new document in collection "users"
//     let queryRef = db
//       .collection('companys')
//       .doc(companyId)
//       .collection('requests')
//       .withConverter(rideRequestConverter)
//     // .where(field, condition, value)
//     // .get()

//     queryRef.where(field, condition, value)

//     return queryRef
//   } catch (error) {
//     console.error('Error getting document: ', error)
//     return
//   }
// }

export async function rideRequestMultiQuery(companyId, querys) {
  try {
    // Add a new document in collection "users"
    let queryRef = db
      .collection('companys')
      .doc(companyId)
      .collection('requests')
      .withConverter(rideRequestConverter)

    querys.forEach((query) => {
      queryRef = queryRef.where(query.field, query.condition, query.value)
    })
    let query = await queryRef.get()
    const requestList = []
    query.forEach((doc) => {
      requestList.push(rideRequestConverter.fromData(doc.data()))
    })

    return requestList && !requestList.length ? null : []
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function rideRequestOrder(companyId) {
  try {
    // Add a new document in collection "users"
    let querySnapshot = await db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .withConverter(workTripConverter)
      .orderBy('start')

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
