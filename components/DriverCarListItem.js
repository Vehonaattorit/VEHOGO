import React, {useState} from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon, Button} from 'native-base'
import NewRideForm from '../views/NewRideForm'

const DriverCarListItem = ({singleItem, navigation, loadCars}) => {

  const [showItem, setItemVisibility] = useState(true)
  return (
    <Content>

      { showItem ? (

          <Card style={styles.list} >

            <CardItem style={styles.item}>
              <Left>
                <Icon active name="document-text-outline" />
                <Text style={styles.title}>{singleItem.registerNumber}</Text>
              </Left>
              <Right>
                <Text style={styles.title}>seats: {singleItem.availableSeats}</Text>
              </Right>
            </CardItem>

            <CardItem style={styles.item}>
              <Left>
                <Icon active name="car-outline" />
                <Text style={styles.title}>{singleItem.vehicleDescription}</Text>

              </Left>
            </CardItem>

            <CardItem style={styles.item}>
              <Left>
                <Icon active name="person-outline" />
                <Text style={styles.title}>Driver: {singleItem.driverName}</Text>
              </Left>
              <Right>
                <Button onPress={() => setItemVisibility(false)}><Icon active name="create-outline" /></Button>
              </Right>
            </CardItem>

          </Card>

      ) : (
        <>
        <NewRideForm carId={singleItem.id} setItemVisibility={setItemVisibility} loadCars={loadCars} modify={true} ></NewRideForm>
        </>
      )

      }
    </Content>
  )
}

const styles = StyleSheet.create({
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
