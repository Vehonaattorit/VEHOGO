import firebase from 'firebase'
import {firebaseConfig} from '../secrets/secrets'


if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}


export default firebase
