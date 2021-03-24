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
    return {
      driverID: workTrip.driverID,
      workDays: workTrip.workDays,
      car: workTrip.car,
    }
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new ScheduledDrive({
      id: data.id,
      driverID: data.driverID,
      workDays: data.workDays,
      car: data.car,
    })
  },
}
