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
  GOOGLE_API_KEY,
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
export const googleMapsApiKey = GOOGLE_API_KEY
export {firebaseConfig}

import {Platform} from 'react-native'

import * as AuthSession from 'expo-auth-session'

export const azureAdAppProps = {
  redirectUri:
    Platform.OS === 'android'
      ? AuthSession.makeRedirectUri({
          scheme: 'vehogoride',
          path: 'calendar',
        })
      : `host.exp.exponent://expo.io/@user-name/slug`,
  clientId: clientId,
  tenantId: tenantId,
  prompt: prompt,
  scope: scope,
}
