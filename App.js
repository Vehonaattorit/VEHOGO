import {
  StyleSheet,
  Platform,
  SafeAreaView,
  Button,
  Text,
  View,
} from 'react-native'

// Outlook Calendar
import ReactNativeCalendar from './views/ReactNativeCalendar'

import * as React from 'react'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as AppAuth from 'expo-app-auth'

// import {Linking} from 'expo'

WebBrowser.maybeCompleteAuthSession()

const useProxy = true

// const baseRedirectUrl = Linking.makeUrl('/')

const localhost = 'https://192.168.1.3:19000/'

console.log('LOCALHOST', localhost)

// YOU DO NOT NEED
// const redirectUri = AuthSession.makeRedirectUri({
//   native: 'http://localhost:19000/',
//   useProxy: true,
// })

console.log('AuthSession.getRedirectUrl() ', AuthSession.getRedirectUrl())
// console.log('baseRedirectUrl', baseRedirectUrl)
console.log('PERKULE', AppAuth.OAuthRedirect + `://expo.io/@user-name/slug`)

const TestLogin = () => {
  const discovery = AuthSession.useAutoDiscovery(
    'https://login.microsoftonline.com/common/v2.0'
  )

  // Create and load an auth request
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '7c89d5a2-62cd-46e2-859a-dc26644c7e1f',
      redirectUri: AppAuth.OAuthRedirect + '://expo.io/@user-name/slug',
      clientSecret: '8ff5d29d-1f07-42f0-a6f6-c0662e330d2b',
      scopes: [
        'openid',
        'offline_access',
        'profile',
        'User.Read',
        'MailboxSettings.Read',
        'Calendars.ReadWrite',
      ],
      serviceConfiguration: {
        authorizationEndpoint:
          'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenEndpoint:
          'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      },
    },
    discovery
  )

  console.log('RESULT', result)

  const azureAdAppProps = {
    clientId: '7c89d5a2-62cd-46e2-859a-dc26644c7e1f',
    tenantId: '7b0aeed8-1749-4bf9-b944-e6242242df6d',
    scope: 'User.read',
    redirectUri:
      Platform.OS === 'android'
        ? AuthSession.makeRedirectUri()
        : AppAuth.OAuthRedirect + '://expo.io/@user-name/slug',
    // redirectUrl: AppAuth.OAuthRedirect + '://expo.io/@user-name/slug',
    prompt: 'login',
    // serviceConfiguration: {
    //   authorizationEndpoint:
    //     'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    //   tokenEndpoint:
    //     'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    // },
  }

  const openAuthSession = async () => {
    const authUrl = `https://login.microsoftonline.com/${
      azureAdAppProps.tenantId
    }/oauth2/v2.0/authorize?client_id=${
      azureAdAppProps.clientId
    }&response_type=code&scope=${encodeURIComponent(
      azureAdAppProps.scope
    )}&prompt=login&redirect_uri=${encodeURIComponent(
      azureAdAppProps.redirectUri
    )}`

    const jotainUutta = {
      authUrl: authUrl,
      returnUrl: azureAdAppProps.redirectUrl || AuthSession.makeRedirectUri(),
    }
    console.log('authUrl', authUrl)

    console.log('jotainUutta', jotainUutta.returnUrl)

    let authResponse = await AuthSession.startAsync(jotainUutta)
      .then((authResponse) => {
        //Conditional if the user proceeds with the authentication process
        if (authResponse.type === 'success') {
          /*
            Only continue with the authentication process if user does not cancel or close 
            the ongoing authentication window or session. authResponse and the code from 
            the parameters will be defined if the authorization session continues. 
          */

          console.log("authResponse.type === 'success') ")

          //Do not proceed with acquiring a token if there is an error. Return the error and the response.
          if (authResponse.params['error']) {
            /* 
                Return error as an added error property value in the object for easier 
                catching of the error in the front end 
              */
            console.log("authResponse.params['error']")

            return {
              error: authResponse.params.error,
              ...authResponse,
            }
          } else {
            //If authentication is successful, pass the authorization code to get the token

            console.log('!!! Authentication was successful !!!', authResponse)
            // return getToken(authResponse.params.code, props)
          }
        } //end if-statement
        //Else statement to catch if the user has decline continuing further with authentication.
        else {
          console.log('Authorization session cancelled')
          //Return the authResponse which wil include a type of dismissed or cancelled.
          return {
            error: 'Authorization session cancelled',
            ...authResponse,
          }
        } //end else-statement.
      })
      .catch((error) => {
        console.error(error)
        return {
          error: error,
          type: 'error',
        }
      })

    return authResponse
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title="Login!"
        // disabled={!request}
        onPress={() => {
          let result = openAuthSession()

          console.log('RESULT', result)
        }}
      />
      {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ReactNativeCalendar />
      {/* <TestLogin /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
