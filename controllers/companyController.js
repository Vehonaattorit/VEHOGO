import firebase from 'firebase/app'
import {v4} from 'uuid/v4'
import {companyConverter, Company} from '../models/company'
import 'firebase/firestore'

const db = firebase.firestore()

export async function updateCompany(company) {
  try {
    if (company.id == undefined) {
      company.id = v4()
    }
    // Add a new document in collection "users"
    let companyRef = db.collection('companys').doc(company.id)

    companyRef.withConverter(companyConverter).set(company, {merge: true})

    return company.id
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getCompany(companyId) {
  try {
    // Add a new document in collection "users"
    let doc = await db
      .collection('companys')
      .doc(companyId)
      .withConverter(companyConverter)
      .get()

    return doc.data()
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function getCompanys() {
  try {
    // Add a new document in collection "users"
    let snapShot = await db
      .collection('companys')
      .withConverter(companyConverter)
      .get()
    const companyList = []
    snapShot.forEach((doc) => {
      companyList.push(
        new Company({
          id: doc.id,
          displayName: doc.data().displayName,
          location: doc.data().location,
          address: doc.data().address,
          userIDs: doc.data().userIDs,
        })
      )
    })
    return companyList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export function companyStream(companyId) {
  try {
    // Add a new document in collection "users"
    let ref = db
      .collection('companys')
      .doc(companyId)
      .withConverter(companyConverter)

    return ref
  } catch (error) {
    console.error('Error getting document stream: ', error)
    return
  }
}

export async function companyQuery(field, condition, value) {
  try {
    // Add a new document in collection "users"
    let querySnapshot = await db
      .collection('companys')
      .withConverter(companyConverter)
      .where(field, condition, value)
      .get()

    const companyList = []
    querySnapshot.forEach((doc) => {
      companyList.push(
        new Company({
          id: doc.id,
          displayName: doc.data().displayName,
          location: doc.data().location,
          address: doc.data().address,
          userIDs: doc.data().userIDs,
          city: doc.data().city,
        })
      )
    })
    return companyList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}
