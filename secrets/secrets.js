// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  clientId,
  tenantId,
  prompt,
  scope,
} from '@env'

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
}
export const googleMapsApiKey = 'AIzaSyAoqMKIm3iIs5pshqmzjwWOOylH8VzlyvM'
export {firebaseConfig}

import {Platform} from 'react-native'

import AppAuth from 'expo-app-auth'
import * as AuthSession from 'expo-auth-session'

export const azureAdAppProps = {
  redirectUri:
    Platform.OS === 'android'
      ? AuthSession.makeRedirectUri()
      : `host.exp.exponent://expo.io/@user-name/slug`,
  clientId: clientId,
  tenantId: tenantId,
  prompt: prompt,
  scope: scope,
}
