import React from 'react'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'
import {updateWorkTrip} from '../controllers/workTripController'
import {WorkTrip} from '../models/workTrip'
import firebase from 'firebase/app'

export const updateUserPosition = async(user,workTripId) => {

    //get current position of user
    let location = await Location.getCurrentPositionAsync({})

    //modify location to be GeoPoint
    const locationPoint = new firebase.firestore.GeoPoint(
      location.coords.latitude,
      location.coords.longitude,
    )
    const time = new Date()

    const workTripToUpdate = new WorkTrip({
      id: workTripId, driverCurrentLocation: {
        location: locationPoint,
        speed: location.coords.speed,
        time: new firebase.firestore.Timestamp.fromDate(time)
      }
    })
    await updateWorkTrip(user.company.id, workTripToUpdate)
    console.log('location updated')
    return location

  }
