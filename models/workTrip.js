import {WorkDay, workDayConverter} from './workDay'
import {carConverter} from './car'
export class WorkTrip {
  constructor({id, driverID, workDays, car}) {
    this.id = id
    this.driverID = driverID
    this.workDays = workDays
    this.car = car
  }
}

// Firestore data converter
export const workTripConverter = {
  toFirestore: function (workTrip) {
    let workTripObject = {}
    if (workTrip.driverID != undefined) {
      workTripObject.driverID = workTrip.driverID
    }
    if (workTrip.workDays != undefined && workTrip.workDays.size > 0) {
      const workDays = []
      workTrip.workDays.forEach((workDay) => {
        workDays.push(workDayConverter.toFirestore(workDay))
      })
      workTripObject.workDays = workDays
    }
    if (workTrip.car != undefined) {
      workTripObject.car = workTrip.car
    }

    return workTripObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    const parsedWorkDays = []
    if (data.workDays != undefined) {
      data.workDays.forEach((workDay) => {
        parsedWorkDays.push(workDayConverter.fromFirestore(workDay))
      })
    }
    return new ScheduledDrive({
      id: data.id,
      driverID: data.driverID,
      workDays: parsedWorkDays,
      car: carConverter.fromFirestore(data.car),
    })
  },
}
