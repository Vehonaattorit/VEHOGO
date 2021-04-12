import {GraphAuthProvider} from './GraphAuthProvider'
import AsyncStorage from '@react-native-community/async-storage'

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
      throw new Error(err)
    }
  }

  static getCalendarView = async (start, end, timezone) => {
    let graphResponse = null
    let finalResponse = null

    try {
      const token = await AsyncStorage.getItem('userToken')

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

  static createEvent = async (eventData) => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      let graphResponse = null

      await fetch('https://graph.microsoft.com/v1.0/me/events?', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(eventData),
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

      return finalResponse
    } catch (err) {
      throw new Error(err)
    }
  }
}
