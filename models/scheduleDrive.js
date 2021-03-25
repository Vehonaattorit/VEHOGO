import {stopConverter} from './stop'
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
    let scheduledDriveObject = {}
    if (scheduledDrive.start != undefined) {
      scheduledDriveObject.start = scheduledDrive.start
    }
    if (scheduledDrive.end != undefined) {
      scheduledDriveObject.end = scheduledDrive.end
    }
    if (scheduledDrive.workTrip != undefined) {
      scheduledDriveObject.workTrip = scheduledDrive.workTrip
    }
    if (scheduledDrive.takenSeats != undefined) {
      scheduledDriveObject.takenSeats = scheduledDrive.takenSeats
    }
    if (scheduledDrive.stops != undefined && scheduledDrive.stops.size > 0) {
      const stops = []
      scheduledDrive.stops.forEach((stop) => {
        stops.push(stopConverter.toFirestore(stop))
      })
      scheduledDriveObject.stops = stops
    }
    return scheduledDriveObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    const parsedStops = []
    if (data.stops != undefined) {
      data.stops.forEach((stop) => {
        parsedStops.push(stopConverter.fromFirestore(stop))
      })
    }
    return new ScheduledDrive({
      start: data.start,
      end: data.end,
      workTrip: data.workTrip,
      takenSeats: data.takenSeats,
      stops: parsedStops,
    })
  },
}
