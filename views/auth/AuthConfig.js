import {Platform} from 'react-native'

import AppAuth from 'expo-app-auth'
import * as AuthSession from 'expo-auth-session'

export const azureAdAppProps = {
  redirectUri:
    Platform.OS === 'android'
      ? AuthSession.makeRedirectUri()
      : `host.exp.exponent://expo.io/@user-name/slug`,
  clientId: '7c89d5a2-62cd-46e2-859a-dc26644c7e1f',
  tenantId: '7b0aeed8-1749-4bf9-b944-e6242242df6d',
  prompt: 'login',
  scope: 'User.Read openid profile email User.ReadWrite offline_access',
}
