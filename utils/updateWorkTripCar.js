import React from 'react'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'
import {WorkTrip} from '../models/workTrip'
import {getWorkTrip, updateWorkTrip} from '../controllers/workTripController'
import {getCar} from '../controllers/carController'
import firebase from 'firebase/app'

export const updateUserCarToWorkTrips = async (user) => {
  if(user.schoosedCarID == undefined){
    throw Error('no schoosed car id defined when calling updateUserCarToWorkTrips()')
  }
  let car = await getCar(user.id, user.schoosedCarID)
  user.preferedWorkingHours.forEach(hours => {
    updateWorkTrip(user.company.id,new WorkTrip({id:hours.toHomeRefID,car:car}))
    updateWorkTrip(user.company.id,new WorkTrip({id:hours.toWorkRefID,car:car}))
  });
  return
}
