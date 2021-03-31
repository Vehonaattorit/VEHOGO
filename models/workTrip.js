import {WorkDay, workDayConverter} from './workDay'
import {ScheduledDrive, scheduleDriveConverter} from './scheduleDrive'
import {carConverter, Car} from './car'
export class WorkTrip {
  constructor({
    id,
    driverID,
    workDayNum,
    car,
    currentLocation,
    scheduledDrive,
    pendingRideRequests,
    goingTo,
  }) {
    this.id = id
    this.driverID = driverID
    this.currentLocation = currentLocation
    this.workDayNum = workDayNum
    this.scheduledDrive = scheduledDrive
    this.car = car
    this.pendingRideRequests = pendingRideRequests
    this.goingTo = goingTo
  }
}

// Firestore data converter
export const workTripConverter = {
  toFirestore: function (workTrip) {
    let workTripObject = {}
    if (workTrip.id != undefined) {
      workTripObject.id = workTrip.id
    }
    if (workTrip.driverID != undefined) {
      workTripObject.driverID = workTrip.driverID
    }
    if (workTrip.currentLocation != undefined) {
      workTripObject.currentLocation = workTrip.currentLocation
    }
    if (workTrip.workDayNum != undefined) {
      workTripObject.workDayNum = workTrip.workDayNum
    }
    if (workTrip.scheduledDrive != undefined) {
      workTripObject.scheduledDrive = scheduleDriveConverter.toFirestore(
        workTrip.scheduledDrive
      )
    }
    if (workTrip.car != undefined) {
      workTripObject.car = carConverter.toFirestore(workTrip.car)
    }

    if (workTrip.pendingRideRequests != undefined) {
      workTripObject.pendingRideRequests = workTrip.pendingRideRequests
    }

    if (workTrip.goingTo != undefined) {
      workTripObject.goingTo = workTrip.goingTo
    }

    return workTripObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)

    return new WorkTrip({
      id: data.id,
      driverID: data.driverID,
      currentLocation: data.currentLocation,
      workDayNum: data.workDayNum,
      scheduledDrive: data.scheduledDrive,
      pendingRideRequests: data.pendingRideRequests,
      goingTo: data.goingTo,
      car: data.car,
    })
  },
  fromData: function (data) {
    return new WorkTrip({
      id: data.id,
      driverID: data.driverID,
      currentLocation: data.currentLocation,
      workDayNum: data.workDayNum,
      scheduledDrive: scheduleDriveConverter.fromData(data.scheduledDrive),
      pendingRideRequests: data.pendingRideRequests,
      goingTo: data.goingTo,
      car: data.car,
    })
  },
}
