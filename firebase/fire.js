import firebase from 'firebase'

const firebaseConfig = {
//// ADD FIREBASE CONFIG HERE ////////
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}


export default firebase
