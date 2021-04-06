import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon} from 'native-base'

import {TouchableOpacity} from 'react-native'
import moment from 'moment'

import firebase from 'firebase/app'
import {color} from '../constants/colors'

const PassengerListItem = ({navigation, singleItem}) => {
  const {car, goingTo, scheduledDrive, workDayNum, extraDay} = singleItem

  const checkWhatDayItIs = (dayNum) => {
    switch (String(dayNum)) {
      case '1':
        return 'Monday'
      case '2':
        return 'Tuesday'
      case '3':
        return 'Wednesday'
      case '4':
        return 'Thursday'
      case '5':
        return 'Friday'
      case '6':
        return 'Saturday'
      case '7':
        return 'Sunday'
      default:
        return 'Monday'
    }
  }

  return (
    <TouchableOpacity
      // style={styles.listItem}
      onPress={() =>
        navigation.navigate('RequestRide', {
          singleItem,
        })
      }
    >
      <View style={styles.listItem}>
        <View style={styles.rectStack}>
          <View style={styles.rectangle}>
            <View style={styles.topRow}>
              <Text style={styles.passengerName}>{car.driverName}</Text>
              <Text style={styles.takenSeats}>3/4</Text>
            </View>
            <View style={styles.breakPoint}></View>
            <View style={styles.bottomRow}>
              <Text style={styles.leaveTime}>
                {moment(scheduledDrive.start.toDate()).format('HH:mm')}
              </Text>
              <Text style={styles.atPassengersText}>???</Text>
              <Text style={styles.atWorkTime}>
                {moment(scheduledDrive.end.toDate()).format('HH:mm')}
              </Text>
            </View>
          </View>
          <View style={styles.leftGoingTo}>
            <Text style={styles.goingToText}>{goingTo}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    marginHorizontal: 20,
  },
  rectangle: {
    backgroundColor: color.darkPurple,
    borderRadius: 24,
  },
  passengerName: {
    // fontFamily: 'roboto-regular',

    flex: 1,
    color: 'white',
  },
  takenSeats: {
    flex: 1,
    // fontFamily: 'roboto-regular',
    color: 'white',
  },
  topRow: {
    height: 25,
    flexDirection: 'row',
    marginTop: 21,
    marginLeft: 97,
    marginRight: 17,
  },
  breakPoint: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 12,
  },
  leaveTime: {
    // fontFamily: 'roboto-regular',
    flex: 1,
    color: 'white',
  },
  rect4: {
    top: 6,
    left: 30,
    height: 2,
    backgroundColor: '#E6E6E6',
  },
  leaveTimeStack: {
    height: 25,
  },
  atPassengersText: {
    // fontFamily: 'roboto-regular',
    flex: 1,
    color: 'white',
    height: 24,
  },
  rect5: {
    top: 6,
    left: 32,
    height: 2,
    backgroundColor: '#E6E6E6',
  },
  atPassengersStack: {
    height: 24,
  },
  atWorkTime: {
    // fontFamily: 'roboto-regular',
    flex: 1,
    color: 'white',
    height: 24,
  },
  bottomRow: {
    height: 25,
    flexDirection: 'row',
    marginTop: 23,
    marginLeft: 97,
    marginRight: 17,
  },
  leftGoingTo: {
    top: 0,
    bottom: 0,
    position: 'absolute',

    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000000',
    // borderRadius: 24,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    padding: 20,
    justifyContent: 'center',
  },
  goingToText: {
    // fontFamily: 'roboto-regular',
    color: 'black',
  },
  rectStack: {
    marginTop: 20,
  },
})

export default PassengerListItem

// return (
//   <TouchableOpacity
//     style={styles.listItem}
//     onPress={() =>
//       navigation.navigate('RequestRide', {
//         singleItem,
//       })
//     }
//   >
//     <Content>
//       <Card style={styles.list}>
//         <CardItem style={styles.item}>
//           <Left>
//             <Icon active name="person-outline" />
//             <Text style={styles.title}>
//               {car.driverName} to {goingTo} place{' '}
//               {checkWhatDayItIs(
//                 extraDay ? Number(workDayNum) + Number(extraDay) : workDayNum
//               )}
//             </Text>
//           </Left>
//           <Right>
//             <Text style={styles.title}>{singleItem.distance}20 km</Text>
//           </Right>
//         </CardItem>
//         <CardItem style={styles.item}>
//           <Left>
//             <Icon active name="location-outline" />
//             <Text style={styles.title}>
//               {scheduledDrive.stops[0].address}
//             </Text>
//           </Left>
//         </CardItem>
//         <CardItem style={styles.item}>
//           <Left>
//             <Icon active name="time" />
//             <Text>
//               {moment(scheduledDrive.start.toDate()).format('HH:mm') +
//                 ' - ' +
//                 moment(scheduledDrive.end.toDate()).format('HH:mm')}
//             </Text>
//           </Left>
//         </CardItem>
//       </Card>
//     </Content>
//   </TouchableOpacity>
// )
// }

// <View style={{flexDirection: 'row'}}>
//         <View
//           style={{
//             marginVertical: 20,
//             backgroundColor: 'white',
//             height: '100%',
//           }}
//         >
//           <Text>Work</Text>
//         </View>
//         <View
//           style={{
//             flexDirection: 'column',
//           }}
//         >
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//           >
//             <View>
//               <Text>Laura</Text>
//             </View>
//             <View>
//               <Text>Laura</Text>
//             </View>
//           </View>
//           <View style={{flexDirection: 'row'}}>
//             <Text>fsafas</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
