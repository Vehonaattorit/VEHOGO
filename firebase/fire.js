import firebase from 'firebase'

const firebaseConfig = {

};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}


export default firebase


