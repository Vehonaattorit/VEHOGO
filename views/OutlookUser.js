import React, {useState} from 'react'
import {View, Text, Button} from 'react-native'

// import {GraphManager} from './graph/GraphManager'

// Azure Microsoft
// import * as MicrosoftGraph from '@microsoft/microsoft-graph-types'

const OutlookUser = () => {
  const [state, setState] = useState({
    // TEMPORARY
    userLoading: true,
    userFirstName: 'Adele',
    userFullName: 'Adele Vance',
    userEmail: 'adelev@contoso.com',
    userTimeZone: 'UTC',
    // userPhoto: require('../images/no-profile-pic.png')
  })

  // useEffect(() => {
  //   loadUser = async () => {
  //     try {
  //       // Get the signed-in user from Graph
  //       const user = await GraphManager.getUserAsync()

  //       // Update UI with display name and email
  //       this.setState({
  //         userLoading: false,
  //         userFirstName: user.givenName || '',
  //         userFullName: user.displayName || '',
  //         // Work/School accounts have email address in mail attribute
  //         // Personal accounts have it in userPrincipalName
  //         userEmail: user.mail || user.userPrincipalName,
  //         userTimeZone: user.mailboxSettings?.timeZone || '',
  //       })
  //     } catch (error) {
  //       Alert.alert(
  //         'Error getting user',
  //         JSON.stringify(error),
  //         [
  //           {
  //             text: 'OK',
  //           },
  //         ],
  //         {cancelable: false}
  //       )
  //     }
  //   }
  //   loadUser()
  // }, [])

  return (
    <View>
      <Text>Outlook User</Text>
      <Text>User is signed in</Text>
    </View>
  )
}

export default OutlookUser
