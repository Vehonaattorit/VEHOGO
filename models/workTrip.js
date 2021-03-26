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
  }) {
    this.id = id
    this.driverID = driverID
    this.currentLocation = currentLocation
    this.workDayNum = workDayNum
    this.scheduledDrive = scheduledDrive
    this.car = car
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

    return workTripObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new ScheduledDrive({
      id: data.id,
      driverID: data.driverID,
      currentLocation: data.currentLocation,
      workDayNum: data.workDayNum,
      scheduledDrive: scheduleDriveConverter.fromData(data.scheduledDrive),
      car: carConverter.fromData(data.car),
    })
  },
  fromData: function (data) {
    return new ScheduledDrive({
      id: data.id,
      driverID: data.driverID,
      currentLocation: data.currentLocation,
      workDayNum: data.workDayNum,
      scheduledDrive: scheduleDriveConverter.fromData(data.scheduledDrive),
      car: carConverter.fromData(data.car),
    })
  },
}
