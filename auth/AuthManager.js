import AsyncStorage from '@react-native-community/async-storage'
import {authorize, refresh, AuthConfiguration} from 'react-native-app-auth'
import {Platform} from 'react-native'
import moment from 'moment'

import {AuthConfig} from './AuthConfig'

import * as AppAuth from 'expo-app-auth'

const config = {
  clientId: AuthConfig.appId,
  redirectUrl: 'graph-tutorial://react-native-auth/',
  scopes: AuthConfig.appScopes,
  additionalParameters: {prompt: 'select_account'},
  serviceConfiguration: {
    authorizationEndpoint:
      'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  },
}

export class AuthManager {
  static signInAsync = async () => {
    // const redirectUrl = AuthSession.getRedirectUrl()
    console.log('Sign in Async')
    try {
      // const result = await authorize(config)
      let result = await AppAuth.authAsync(config)
      console.log(`result ${result ? result : 'no result'}`)
      console.log('access token', result.accessToken)

      // // Store the access token, refresh token, and expiration time in storage
      await AsyncStorage.setItem('userToken', result.accessToken)
      await AsyncStorage.setItem('refreshToken', result.refreshToken)
      await AsyncStorage.setItem('expireTime', result.accessTokenExpirationDate)
    } catch (err) {
      console.log('err', err)
    }
  }

  static signOutAsync = async () => {
    // Clear storage

    console.log('Signing out')
    await AsyncStorage.removeItem('userToken')
    await AsyncStorage.removeItem('refreshToken')
    await AsyncStorage.removeItem('expireTime')
  }

  static getAccessTokenAsync = async () => {
    const expireTime = await AsyncStorage.getItem('expireTime')

    console.log('epxireTime', expireTime)
    console.log('Get Access Token Async')

    if (expireTime !== null) {
      // Get expiration time - 5 minutes
      // If it's <= 5 minutes before expiration, then refresh

      const expire = moment(expireTime).subtract(5, 'minutes')
      const now = moment()

      if (now.isSameOrAfter(expire)) {
        // Expired, refresh
        console.log('Refreshing token')
        const refreshToken = await AsyncStorage.getItem('refreshToken')
        console.log(`Refresh token: ${refreshToken}`)
        // TEMPORARY
        // const result = await refresh(config, {refreshToken: refreshToken || ''})
        const result = await AppAuth.refreshAsync(config, refreshToken)
        console.log('refreshAuth', result)

        // Store the new access token, refresh token, and expiration time in storage
        await AsyncStorage.setItem('userToken', result.accessToken)
        await AsyncStorage.setItem('refreshToken', result.refreshToken || '')
        await AsyncStorage.setItem(
          'expireTime',
          result.accessTokenExpirationDate
        )

        return result.accessToken
      }

      return null
    }
  }
}
