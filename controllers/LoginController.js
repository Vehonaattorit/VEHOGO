import firebase from '../firebase/fire'
import {updateUser} from '../controllers/userController'
import {User} from '../models/user'
import Constants from 'expo-constants'

import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'

import {PUBLIC_VAPID_KEY} from '@env'

export async function login(email, password) {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      registerForPushNotificationsAsync(user)
    })
}

export async function register(email, password) {
  try {
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)

    await response.user.sendEmailVerification()
    return response
  } catch (e) {
    return e.message
  }
}

export async function signOut() {
  try {
    await firebase.auth().signOut()
  } catch (e) {}
}

export async function subscribeToAuth(authStateChanged) {
  if (!firebase.apps.length) {
    await firebase.initializeApp(firebaseConfig)
  }
  firebase.auth().onAuthStateChanged((user) => {
    if (user != null) {
      update(user.uid)
      //await updateUser(new User({id: user.uid}))
    }
    authStateChanged(user)
  })
}

const update = async (id) => {
  await updateUser(new User({id: id}))
}

export async function checkEmailVerification() {
  try {
    const response = firebase.auth().currentUser.emailVerified
    return response
  } catch (e) {
    return e.message
  }
}

const registerForPushNotificationsAsync = async ({user}) => {
  let token
  if (Constants.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getDevicePushTokenAsync()).data
    console.log('user token', token)

    await updateUser(new User({id: user.uid, expoToken: token}))
  } else {
    alert('Must use physical device for Push Notifications')
  }

  // await getToken()

  return token
}

// const getToken = () => {
//   const messaging = firebase.messaging()
//   // [START messaging_get_token]
//   // Get registration token. Initially this makes a network call, once retrieved
//   // subsequent calls to getToken will return from cache.

//   messaging.getToken({vapidKey: PUBLIC_VAPID_KEY}).then((currentToken) => {
//     if (currentToken) {
//       // Send the token to your server

//       console.log('CUR token 234', currentToken)
//     }
//   })
// }
