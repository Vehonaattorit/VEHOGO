import {WorkDay, workDayConverter} from './workDay'
import {ScheduledDrive, scheduleDriveConverter} from './scheduleDrive'
import {carConverter, Car} from './car'
export class WorkTrip {
  constructor({
    id,
    driverID,
    driverName,
    workDayNum,
    car,
    driverCurrentLocation,
    scheduledDrive,
    goingTo,
    route,
    isDriving,
  }) {
    this.id = id
    this.driverID = driverID
    this.driverName = driverName
    this.driverCurrentLocation = driverCurrentLocation
    this.workDayNum = workDayNum
    this.scheduledDrive = scheduledDrive
    this.car = car
    this.goingTo = goingTo
    this.route = route
    this.isDriving = isDriving
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
    if (workTrip.driverName != undefined) {
      workTripObject.driverName = workTrip.driverName
    }
    if (workTrip.driverCurrentLocation != undefined) {
      workTripObject.driverCurrentLocation = workTrip.driverCurrentLocation
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

    if (workTrip.goingTo != undefined) {
      workTripObject.goingTo = workTrip.goingTo
    }

    if (workTrip.route != undefined) {
      workTripObject.route = workTrip.route
    }
    if (workTrip.isDriving != undefined) {
      workTripObject.isDriving = workTrip.isDriving
    }

    return workTripObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)

    return new WorkTrip({
      id: data.id,
      driverID: data.driverID,
      driverID: data.driverName,
      driverCurrentLocation: data.driverCurrentLocation,
      workDayNum: data.workDayNum,
      scheduledDrive: data.scheduledDrive,
      goingTo: data.goingTo,
      isDriving: data.isDriving,
      car: data.car,
      route: data.route,
    })
  },
  fromData: function (data) {
    return new WorkTrip({
      id: data.id,
      driverID: data.driverID,
      driverID: data.driverName,
      driverCurrentLocation: data.driverCurrentLocation,
      workDayNum: data.workDayNum,
      scheduledDrive: scheduleDriveConverter.fromData(data.scheduledDrive),
      goingTo: data.goingTo,
      isDriving: data.isDriving,
      car: data.car,
      route: data.route,
    })
  },
}
