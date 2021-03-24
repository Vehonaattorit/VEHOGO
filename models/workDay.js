export class WorkDay {
  constructor({workDay, toWorkDrive, toHomeDrive, currentLocation}) {
    this.workDay = workDay
    this.toWorkDrive = toWorkDrive
    this.toHomeDrive = toHomeDrive
    this.currentLocation = currentLocation
  }
}

// Firestore data converter
export const companyConverter = {
  toFirestore: function (scheduledDrive) {
    return {
      start: scheduledDrive.start,
      end: scheduledDrive.end,
      workTrip: scheduledDrive.workTrip,
      takenSeats: scheduledDrive.takenSeats,
      stops: scheduledDrive.stops,
    }
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new ScheduledDrive({
      id: data.id,
      start: data.start,
      end: data.end,
      workTrip: data.workTrip,
      takenSeats: data.takenSeats,
      stops: data.stops,
    })
  },
}
