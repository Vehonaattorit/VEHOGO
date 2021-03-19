import {Client} from '@microsoft/microsoft-graph-client'
import {GraphAuthProvider} from './GraphAuthProvider'
import AsyncStorage from '@react-native-community/async-storage'

// Set the authProvider to an instance
// of GraphAuthProvider
const clientOptions = {
  authProvider: new GraphAuthProvider(),
}

// Initialize the client
const graphClient = Client.initWithMiddleware(clientOptions)

export class GraphManager {
  static getUserAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      let graphResponse = null

      await fetch(
        'https://graph.microsoft.com/v1.0/me?$select=displayName,givenName,mail,mailboxSettings,userPrincipalName',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      )
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

      return finalResponse
    } catch (err) {
      console.log(err)

      throw new Error(err)
    }

    // TEMPORARY
    // GET /me
    // return await graphClients
    //   .api('/me')
    //   .select('displayName,givenName,mail,mailboxSettings,userPrincipalName')
    //   .get()
  }

  static getCalendarView = async (start, end, timezone) => {
    let graphResponse = null
    let finalResponse = null

    console.log('getCalendarView', start, end, timezone)
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
