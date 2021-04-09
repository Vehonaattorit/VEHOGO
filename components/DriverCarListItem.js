import React, {useState} from 'react'
import {StyleSheet, View, TextInput, Text, TouchableOpacity} from 'react-native'
import {
  Content,
  Card,
  CardItem,
  // Text,
  Left,
  Right,
  Icon,
  Button,
} from 'native-base'
import NewRideForm from '../views/NewRideForm'
import {color} from '../constants/colors'
import {Entypo, AntDesign, MaterialCommunityIcons} from '@expo/vector-icons'

const DriverCarListItem = ({singleItem, navigation, loadCars}) => {
  const [showItem, setItemVisibility] = useState(true)

  const edit = () => {
    navigation.navigate('CarEditForm', {editCar: singleItem})
  }

  return (
    <View style={styles.container}>
      <View style={styles.formItem}>
        <View style={styles.iconContainer}>
          <Icon active name="car-outline" />
        </View>
        <Text>{singleItem.registerNumber}</Text>
        <View
          style={{...styles.iconContainer, backgroundColor: color.lightBlue}}
        >
          <MaterialCommunityIcons
            name="seat-passenger"
            size={30}
            color={color.lightBlack}
          />
          <Text>{singleItem.availableSeats}</Text>
        </View>
        <View
          style={{
            flex: 1,

            alignItems: 'center',
            alignItems: 'flex-end',
          }}
        >
          <View>
            <Button
              style={{
                backgroundColor: 'white',
                padding: 10,
                margin: 10,
                borderRadius: 10,
              }}
              onPress={edit}
            >
              {/* <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                margin: 10,
                borderRadius: 10,
              }}
            ></View> */}
              <AntDesign name="edit" size={24} color={color.lightBlack} />
            </Button>
          </View>
        </View>
      </View>
    </View>
    // <Content>
    //   <Card style={styles.list}>
    //     <CardItem style={styles.item}>
    //       <Left>
    //         <Icon active name="document-text-outline" />
    //         <Text style={styles.title}>{singleItem.registerNumber}</Text>
    //       </Left>
    //       <Right>
    //         <Text style={styles.title}>seats: {singleItem.availableSeats}</Text>
    //       </Right>
    //     </CardItem>

    //     <CardItem style={styles.item}>
    //       <Left>
    //         <Icon active name="car-outline" />
    //         <Text style={styles.title}>{singleItem.vehicleDescription}</Text>
    //       </Left>
    //     </CardItem>

    //     <CardItem style={styles.item}>
    //       <Left>
    //         <Icon active name="person-outline" />
    //         <Text style={styles.title}>Driver: {singleItem.driverName}</Text>
    //       </Left>
    //       <Right>
    //         <Button onPress={() => setItemVisibility(false)}>
    //           <Icon active name="create-outline" />
    //         </Button>
    //       </Right>
    //     </CardItem>
    //   </Card>
    // </Content>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  button: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 15,
  },
  form: {
    margin: 10,
  },
  formItem: {
    backgroundColor: color.lightBlue,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInput: {
    color: color.lightBlack,
    marginLeft: 15,
    height: 40,
    fontSize: 20,
  },
  text: {
    fontFamily: 'open-sans-regular',
    color: color.lightBlack,
  },
  breakPoint: {
    height: 1,
    backgroundColor: color.grey,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  list: {
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  item: {
    backgroundColor: 'white',
  },
})

export default DriverCarListItem

// import React, {useState} from 'react'
// import {StyleSheet, TouchableOpacity} from 'react-native'
// import {Content, Card, CardItem, Text, Left, Right, Icon, Button} from 'native-base'
// import NewRideForm from '../views/NewRideForm'

// const DriverCarListItem = ({singleItem, navigation, loadCars}) => {

//   const [showItem, setItemVisibility] = useState(true)
//   return (
//     <Content>

//       { showItem ? (

//           <Card style={styles.list} >

//             <CardItem style={styles.item}>
//               <Left>
//                 <Icon active name="document-text-outline" />
//                 <Text style={styles.title}>{singleItem.registerNumber}</Text>
//               </Left>
//               <Right>
//                 <Text style={styles.title}>seats: {singleItem.availableSeats}</Text>
//               </Right>
//             </CardItem>

//             <CardItem style={styles.item}>
//               <Left>
//                 <Icon active name="car-outline" />
//                 <Text style={styles.title}>{singleItem.vehicleDescription}</Text>

//               </Left>
//             </CardItem>

//             <CardItem style={styles.item}>
//               <Left>
//                 <Icon active name="person-outline" />
//                 <Text style={styles.title}>Driver: {singleItem.driverName}</Text>
//               </Left>
//               <Right>
//                 <Button onPress={() => setItemVisibility(false)}><Icon active name="create-outline" /></Button>
//               </Right>
//             </CardItem>

//           </Card>

//       ) : (
//         <>
//         <NewRideForm carId={singleItem.id} setItemVisibility={setItemVisibility} loadCars={loadCars} modify={true} ></NewRideForm>
//         </>
//       )

//       }
//     </Content>
//   )
// }

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   list: {
//     marginBottom: 0,
//     marginLeft: 10,
//     marginRight: 10,
//     marginTop: 10,
//     backgroundColor: 'white',
//     borderRadius: 20,
//   },
//   item: {
//     backgroundColor: 'white',
//   },
// })

// export default DriverCarListItem
