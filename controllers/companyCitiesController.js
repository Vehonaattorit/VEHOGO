import firebase from 'firebase/app'
import {v4} from 'uuid/v4'
import 'firebase/firestore'

const db = firebase.firestore()

export async function updateCompanyCity(companyCity) {
  try {
    let companyRef = db.collection('companyCities').doc("cities")

    companyRef.update({
      cities: firebase.firestore.FieldValue.arrayUnion(companyCity)
    })

  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getCompanyCities() {
  try {
    // Add a new document in collection "users"
    let snapShot = await db
      .collection('companyCities')
      .doc('cities')
      .get()

    return snapShot.data().cities
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

