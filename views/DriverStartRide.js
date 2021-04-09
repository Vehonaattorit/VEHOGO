import React, {useContext, useState, useEffect} from 'react'
import {StyleSheet, View, Text} from 'react-native'
// import {
//   Content,
//   Card,
//   CardItem,
//   Body,
//   Container,
//   View,
//   Text,
//   Icon,
//   Button,
// } from 'native-base'
import {Icon, Button} from 'native-base'
import {StopList} from '../components/StopList'
import {UserContext} from '../contexts'
import {updateWorkTrip} from '../controllers/workTripController'
import {getUser} from '../controllers/userController'
import {color} from '../constants/colors'
import * as Location from 'expo-location'

export const DriverStartRide = ({navigation, route}) => {
  let workTrip = route.params.workTrip

  const {user} = useContext(UserContext)

  const [isDriving, setIsDriving] = useState(workTrip.isDriving)

  const startDriving = async () => {
    let workTripToUpdate = workTrip

    workTripToUpdate.isDriving = !workTrip.isDriving

    setIsDriving(workTripToUpdate.isDriving)
    await updateWorkTrip(user.company.id, workTripToUpdate)

    if (workTripToUpdate.isDriving) {
      navigation.navigate('DriverOnRoute', {
        workTrip: workTrip,
      })
    }

    let userIds = workTripToUpdate.scheduledDrive.stops.map(
      (item) => item.userID
    )

    userIds = userIds.filter((item) => item !== user.id)

    for (const userId of userIds) {
      const notifyUser = await getUser(userId)

      console.log('notifyUser', notifyUser)

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: notifyUser.ownerPushToken,
          title: `Driver has started his ride to ${workTripToUpdate.goingTo}.`,
          body: `${workTripToUpdate.car.driverName} is coming to pick you up.`,
        }),
      })
    }
  }

  useEffect(() => {
    ;(async () => {
      let {status} = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }
    })()
  }, [])

  const drivingTime = () => {
    let totalTime = 0
    workTrip.route.routes[0].legs.map((leg) => {
      totalTime += leg.duration.value
    })
    return parseFloat((totalTime / 60).toFixed(0))
  }
  return (
    <View style={styles.view}>
      <View style={styles.iconView}>
        <View style={styles.iconViewBody}>
          <Icon style={styles.icon} active name="car-outline" />
          <Text style={styles.iconText}>Your next ride</Text>
          <Text style={styles.drivingTime}>
            Driving time: {workTrip.route && drivingTime()} mins
          </Text>
          <Button
            large
            style={{
              ...styles.button,
              backgroundColor: isDriving
                ? color.radicalRed
                : color.malachiteGreen,
            }}
            onPress={startDriving}
          >
            <Text style={styles.btntxt}>
              {isDriving ? 'Stop Driving' : 'Start Driving'}
            </Text>
          </Button>
        </View>
      </View>

      <View style={styles.listView}>
        <StopList
          dataArray={workTrip.scheduledDrive.stops}
          route={workTrip.route}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  iconView: {
    flex: 2,
    backgroundColor: 'white',
  },
  iconViewBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 150,
    color: color.darkBlue,
  },
  iconText: {
    fontFamily: 'open-sans-regular',
    fontSize: 26,
  },
  drivingTime: {
    marginTop: 20,
    fontSize: 16,
  },
  listView: {
    flex: 2.5,
  },
  button: {
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    alignSelf: 'center',
  },
  btntxt: {
    fontSize: 24,
    color: color.lightBlack,
  },
})

// import React, {useContext, useState, useEffect} from 'react'
// import {StyleSheet} from 'react-native'
// import {
//   Content,
//   Card,
//   CardItem,
//   Body,
//   Container,
//   View,
//   Text,
//   Icon,
//   Button,
// } from 'native-base'
// import {StopList} from '../components/StopList'
// import {UserContext} from '../contexts'
// import {updateWorkTrip} from '../controllers/workTripController'
// import {getUser} from '../controllers/userController'
// import {color} from '../constants/colors'
// import * as Location from 'expo-location'

// export const DriverStartRide = ({navigation, route}) => {
//   let workTrip = route.params.workTrip

//   const {user} = useContext(UserContext)

//   const [isDriving, setIsDriving] = useState(workTrip.isDriving)

//   const startDriving = async () => {
//     let workTripToUpdate = workTrip

//     workTripToUpdate.isDriving = !workTrip.isDriving

//     setIsDriving(workTripToUpdate.isDriving)
//     await updateWorkTrip(user.company.id, workTripToUpdate)

//     if (workTripToUpdate.isDriving) {
//       navigation.navigate('DriverOnRoute', {
//         workTrip: workTrip,
//       })
//     }

//     let userIds = workTripToUpdate.scheduledDrive.stops.map(
//       (item) => item.userID
//     )

//     userIds = userIds.filter((item) => item !== user.id)

//     for (const userId of userIds) {
//       const notifyUser = await getUser(userId)

//       console.log('notifyUser', notifyUser)

//       await fetch('https://exp.host/--/api/v2/push/send', {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Accept-Encoding': 'gzip, deflate',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           to: notifyUser.ownerPushToken,
//           title: `Driver has started his ride to ${workTripToUpdate.goingTo}.`,
//           body: `${workTripToUpdate.car.driverName} is coming to pick you up.`,
//         }),
//       })
//     }
//   }

//   useEffect(() => {
//     ;(async () => {
//       let {status} = await Location.requestPermissionsAsync()
//       if (status !== 'granted') {
//         console.log('Permission to access location was denied')
//         return
//       }
//     })()
//   }, [])

//   const drivingTime = () => {
//     let totalTime = 0
//     workTrip.route.routes[0].legs.map((leg) => {
//       totalTime += leg.duration.value
//     })
//     return parseFloat((totalTime / 60).toFixed(0))
//   }
//   return (
//     <View style={styles.view}>
//       <View style={styles.iconView}>
//         <Body style={styles.iconViewBody}>
//           <Icon style={styles.icon} active name="car-outline" />
//           <Text style={styles.iconText}>Your Next Ride</Text>

//           <Text>
//             Driving time: {workTrip.route && drivingTime()} mins
//           </Text>
//           <Button
//             large
//             style={{
//               ...styles.button,
//               backgroundColor: isDriving ? color.radicalRed : color.primary,
//             }}
//             onPress={startDriving}
//           >
//             <Text style={styles.btntxt}>
//               {isDriving ? 'Stop Driving' : 'Start Driving'}
//             </Text>
//           </Button>
//           <Text style={styles.iconText}>Stops</Text>
//         </Body>
//       </View>

//       <View style={styles.listView}>
//         <StopList
//           dataArray={workTrip.scheduledDrive.stops}
//           route={workTrip.route}
//         />
//       </View>
//     </View>
//   )
// }
// const styles = StyleSheet.create({
//   view: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   iconView: {
//     flex: 2,
//     backgroundColor: 'white',
//   },
//   iconViewBody: {
//     flex: 1,
//   },
//   icon: {
//     fontSize: 150,
//     flex: 3,
//     color: color.primary,
//   },
//   iconText: {
//     fontSize: 26,
//     flex: 0.75,
//   },
//   listView: {
//     flex: 2.5,
//   },
//   button: {
//     borderRadius: 15,
//     alignSelf: 'center',
//     flex: 0.5,
//   },
//   btntxt: {
//     color: 'white',
//   },
// })
