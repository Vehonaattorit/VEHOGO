import React from 'react'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'
import {WorkTrip} from '../models/workTrip'
import {getWorkTrip, updateWorkTrip} from '../controllers/workTripController'
import {getCar} from '../controllers/carController'
import firebase from 'firebase/app'

export const updateUserCarToWorkTrips = async (user) => {
  if (user.schoosedCarID == undefined) {
    throw Error('no schoosed car id defined when calling updateUserCarToWorkTrips()')
  }
  let car = await getCar(user.id, user.schoosedCarID)
  user.preferedWorkingHours.forEach(async hours => {
    console.log('homeref', hours.toHomeRefID)
    console.log('WorkRefID', hours.toWorkRefID)
    if (hours.toHomeRefID != undefined) {
      const workTrip = await getWorkTrip(user.company.id, hours.toHomeRefID)
      updateWorkTrip(user.company.id, new WorkTrip({id: hours.toHomeRefID, car: car, scheduledDrive: {availableSeats: (parseInt(car.availableSeats - (workTrip.scheduledDrive.stops.length - 2 > 0 ? workTrip.scheduledDrive.stops.length - 2 : 0)))}}))
    }
    if (hours.toWorkRefID != undefined) {
      const workTrip = await getWorkTrip(user.company.id, hours.toWorkRefID)
      updateWorkTrip(user.company.id, new WorkTrip({id: hours.toWorkRefID, car: car, scheduledDrive: {availableSeats: parseInt(car.availableSeats - (workTrip.scheduledDrive.stops.length - 2 > 0 ? workTrip.scheduledDrive.stops.length - 2 : 0))}}))
    }
  });
  return
}
