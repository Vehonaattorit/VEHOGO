import AsyncStorage from '@react-native-community/async-storage'
import {authorize, refresh, AuthConfiguration} from 'react-native-app-auth'
import {Platform} from 'react-native'
import moment from 'moment-timezone'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

import {azureAdAppProps} from './AuthConfig'

import * as Localization from 'expo-localization'

WebBrowser.maybeCompleteAuthSession()

export class AuthManager {
  static signInAsync = async () => {
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${
      azureAdAppProps.clientId
    }&response_type=code&scope=${encodeURIComponent(
      azureAdAppProps.scope
    )}&prompt=login&redirect_uri=${encodeURIComponent(
      azureAdAppProps.redirectUri
    )}`

    const authUrls = {
      authUrl: authUrl,
      returnUrl: azureAdAppProps.redirectUri || AuthSession.makeRedirectUri(),
    }

    let authResponse = await AuthSession.startAsync(authUrls)
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
            //If authentication is successful, pass the authorization code to get the token
            return AuthManager.getToken(authResponse.params.code)
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

  static getToken = async (code) => {
    /* parse/gather correct key values for the POST request to the token endpoint */
    /* Client secret is omitted here; including it yields an error */
    var requestParams = {
      client_id: azureAdAppProps.clientId,
      scope: azureAdAppProps.scope,
      code: code,
      redirect_uri: azureAdAppProps.redirectUri,
      grant_type: 'authorization_code',
    }

    console.log(
      'getus tokenus azureAdAppProps.redirectUri',
      azureAdAppProps.redirectUri
    )
    /* loop through object and encode each item as URI component before storing in array */
    /* then join each element on & */
    /* request is x-www-form-urlencoded as per docs: https://docs.microsoft.com/en-us/graph/use-the-api */
    var formBody = []
    for (var p in requestParams) {
      var encodedKey = encodeURIComponent(p)
      var encodedValue = encodeURIComponent(requestParams[p])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    formBody = formBody.join('&')

    /* make a POST request using fetch and the body params we just setup */
    let tokenResponse = null

    await fetch(`https://login.microsoftonline.com/common/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    })
      .then((response) => response.json())
      .then((response) => {
        tokenResponse = response

        console.log('getus tokenus', tokenResponse)
      })
      .catch((error) => {
        console.error(error)
      })

    await AsyncStorage.setItem('userToken', tokenResponse.access_token)
    await AsyncStorage.setItem(
      'expireTime',
      tokenResponse.expires_in.toString()
    )
    return await AuthManager.callMsGraph(tokenResponse.access_token)
  } //end getToken()

  static checkTokenExpiration = async () => {
    const expireTime = await AsyncStorage.getItem('expireTime')
    const userToken = await AsyncStorage.getItem('userToken')

    let response

    if (expireTime !== null) {
      // Get expiration time - 1 hour
      // If it's <= 5 minutes before expiration, then refresh

      const expire = new Date(new Date().getTime() + 3600 * 100)

      const now = moment()

      if (now.isSameOrAfter(expire)) {
        // Expired refresh

        console.log('now.isSameOrAfter(expire)', response)
      } else {
        // Token is not expired - use token to fetch Calendar Events
        response = await AuthManager.callMsGraph(userToken)

        return response
      }
    } else {
      response = await AuthManager.signInAsync()

      return response
    }

    return null
  }

  /*
    callMsGraph
      queries the Microsoft Graph API to return user data
      params:   token - the unique token used to query the logged in user in the Graph API
      returns:  graphResponse - a JSON object of the user data
*/
  static callMsGraph = async (token) => {
    /* make a GET request using fetch and querying with the token */

    console.log('make a GET callMsGraph request using fetch')
    let graphResponse = null
    await fetch('https://graph.microsoft.com/v1.0/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        graphResponse = response
      })
      .catch((error) => {
        graphResponse = error
      })

    /* 
    Spread the results of the graph and add a type property with a value of success to indicate
    that the AzureAD info grabbing was a success
  */

    const finalResponse = {
      ...graphResponse,
      type: 'success',
    }

    console.log('callMsGraph', finalResponse)

    try {
      // Get the signed in user from Graph

      const tz = Localization.timezone

      // Get midnight on the start of the current week in the user's
      // time zone, but in UTC. For example, for PST, the time value
      // could be 07:00:00Z
      const startOfWeek = moment.tz(tz).startOf('week').utc()

      const endOfWeek = moment(startOfWeek).add(7, 'day')

      let events = await AuthManager.getCalendarView(startOfWeek, endOfWeek, tz)

      events = events.value

      if (events.undefined) return

      let mappedData = events.map((event, index) => {
        return {
          start: moment(event.start.dateTime).format('HH:mm'),
          end: moment(event.end.dateTime).format('HH:mm'),
          // id: event.id,
          subject: event.subject,
          date: moment(event.start.dateTime).format('yyyy-MM-DD'),
        }
      })

      const reduced = mappedData.reduce((acc, currentItem) => {
        const {date, ...allTheRest} = currentItem

        acc[date] !== undefined
          ? acc[date].push(allTheRest)
          : (acc[date] = [allTheRest])

        return acc
      }, {})

      console.log('reduced events', reduced)

      return {
        userToken: token,
        loadingEvents: false,
        events: reduced,
      }
    } catch (err) {
      throw new Error(err)
    }
  } //end callMsGraph()

  static getCalendarView = async (start, end, timezone) => {
    let graphResponse = null
    let finalResponse = null

    console.log('getCalendarView', start, end, timezone)
    console.log(
      'getCalendarView formatted',
      start.format(),
      end.format(),
      timezone
    )
    try {
      const token = await AsyncStorage.getItem('userToken')

      console.log('Access Token', token)

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${start.format()}&endDateTime=${end.format()}&$select=subject,organizer,start,end&$orderby=start/dateTime`,
        {
          method: 'GET',
          headers: {
            // 'Content-Type': 'application/json',
            Prefer: `outlook.timezone="${timezone}"`,

            // Prefer: `outlook.body-content-type="`,
            Authorization: 'Bearer ' + token,
          },
        }
      )

      graphResponse = await response.json()

      console.log('graphResponse calendar', graphResponse)

      /* 
      Spread the results of the graph and add a type property with a value of success to indicate
      that the AzureAD info grabbing was a success
    */
      finalResponse = {
        ...graphResponse,
        type: 'success',
      }
    } catch (err) {
      graphResponse = err

      throw new Error(err)
    }
    return finalResponse
  }
}