import React, {useState, useEffect, useRef, useContext} from 'react'
import {UserContext} from '../contexts'
import {StyleSheet, Dimensions, Image} from 'react-native'
import {Content, Container, ScrollView, Button, Text, View} from 'native-base'
import MapView, {Marker} from 'react-native-maps'
import PassengerRideRequestButton from '../views/passengerRideRequestButton'
import {checkWhatDayItIs, drivingTime} from '../utils/utils'
import moment from 'moment'

import {color} from '../constants/colors'

// Icons
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
const PassengerViewRequestContainer = ({
  user,
  navigation,
  viewPendingRequest,
  rideRequest,
  routeCoordinates,
  singleItem,
  markers,
}) => {
  const [mapRef, setMapRef] = useState(null)

  return (
    <View style={styles.view}>
      <Container style={styles.requestMapContent}>
        <MapView
          ref={(ref) => {
            setMapRef(ref)
          }}
          style={styles.mapStyle}
          provider={MapView.PROVIDER_GOOGLE}
          initialRegion={{
            latitude: singleItem.scheduledDrive.stops[0].location.latitude,
            longitude: singleItem.scheduledDrive.stops[0].location.longitude,
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}
        >
          <MapView.Polyline
            coordinates={routeCoordinates}
            strokeColor="#26AAE2"
            strokeWidth={4}
          />
          {markers}
        </MapView>
      </Container>
      <View style={styles.columnContainer}>
        <View style={styles.rowContainer}>
          <View style={styles.rowItemStartContainer}>
            <View>
              <Ionicons name="person" size={24} color={color.lightBlack} />
            </View>

            <View style={styles.textItemContainer}>
              <Text style={styles.rowContainerText}>
                {singleItem.driverName}
              </Text>
            </View>
          </View>
          <View style={styles.rowItemEndContainer}>
            <View>
              <FontAwesome5 name="route" size={24} color={color.lightBlack} />
            </View>

            <View style={styles.textItemContainer}>
              <Text style={styles.rowContainerText}>2 km</Text>
            </View>
          </View>
        </View>
        <View style={styles.breakPoint}></View>
        <View style={styles.rowContainer}>
          <View style={styles.rowItemStartContainer}>
            <Ionicons name="home" size={24} color={color.lightBlack} />

            <View style={styles.textItemContainer}>
              <Text style={styles.rowContainerText}>
                {rideRequest.driverAddress}
              </Text>
            </View>
          </View>
          <View style={styles.rowItemEndContainer}>
            <View>
              <Ionicons name="time-sharp" size={24} color={color.lightBlack} />
            </View>

            <View style={styles.textItemContainer}>
              <Text style={styles.rowContainerText}>
                {drivingTime(singleItem)} min
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.breakPoint}></View>

        <View style={styles.rowContainer}>
          <View style={styles.rowItemStartContainer}>
            <View>
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={color.lightBlack}
              />
            </View>

            <View style={styles.textItemContainer}>
              <Text style={styles.rowContainerText}>
                {rideRequest == undefined
                  ? checkWhatDayItIs(singleItem.workDayNum)
                  : checkWhatDayItIs(rideRequest.workDayNum)}
              </Text>
            </View>
          </View>
          <View style={styles.rowItemEndContainer}>
            <View>
              <MaterialCommunityIcons
                name="wallet-travel"
                size={24}
                color={color.lightBlack}
              />
            </View>

            <View style={styles.textItemContainer}>
              <Text style={styles.rowContainerText}>
                {singleItem.goingTo === 'home' ? 'Going ' : 'Going to '}
                {rideRequest == undefined
                  ? singleItem.goingTo.charAt(0).toUpperCase() +
                    singleItem.goingTo.slice(1)
                  : singleItem.goingTo.charAt(0).toUpperCase() +
                    singleItem.goingTo.slice(1)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.breakPoint}></View>

        <View style={styles.rowContainer}>
          <View style={styles.rowItemStartContainer}>
            <View>
              <Ionicons name="car" size={24} color={color.lightBlack} />
            </View>

            <View style={styles.textItemContainer}>
              <Text style={styles.rowContainerText}>
                {rideRequest == undefined
                  ? singleItem.goingTo === 'home'
                    ? 'Leaves work at: ' +
                      moment(singleItem.scheduledDrive.start.toDate()).format(
                        'HH:mm'
                      )
                    : 'Leaves home at: ' +
                      moment(singleItem.scheduledDrive.start.toDate()).format(
                        'HH:mm'
                      )
                  : 'Work times: ' +
                    moment(rideRequest.start.toDate()).format('HH:mm') +
                    ' - ' +
                    moment(rideRequest.end.toDate()).format('HH:mm')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PassengerViewRequestContainer

const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#26aae2',
  },
  requestMapContent: {
    flex: 6,
    backgroundColor: 'black',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  breakPoint: {
    height: 1,
    backgroundColor: color.primaryLight,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: color.darkBlue,
    borderRadius: 10,
  },
  btntxt: {
    fontFamily: 'open-sans-regular',
    color: 'white',
  },

  columnContainer: {
    flex: 3,
    backgroundColor: color.lightBlue,
  },
  rowContainer: {
    flex: 1,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowItemStartContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowItemEndContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textItemContainer: {
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: 10,
  },
  rowContainerText: {
    fontSize: 18,
    fontFamily: 'open-sans-regular',
  },
})
