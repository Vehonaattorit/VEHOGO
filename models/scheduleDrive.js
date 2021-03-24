export class ScheduledDrive {
  constructor({id, start, end, workTrip, takenSeats, stops}) {
    this.start = start
    this.end = end
    this.workTrip = workTrip
    this.takenSeats = takenSeats
    this.stops = stops
  }
}

// Firestore data converter
export const scheduleDriveConverter = {
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
      start: data.start,
      end: data.end,
      workTrip: data.workTrip,
      takenSeats: data.takenSeats,
      stops: data.stops,
    })
  },
}
