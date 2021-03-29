import {stopConverter} from './stop'
export class ScheduledDrive {
  constructor({id, start, end, workTrip, takenSeats, stops}) {
    this.start = start
    this.end = end
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
    if (scheduledDrive.takenSeats != undefined) {
      scheduledDriveObject.takenSeats = scheduledDrive.takenSeats
    }
    if (scheduledDrive.stops != undefined && scheduledDrive.stops.length > 0) {
      const stops = []

      console.log('STOPUS', scheduledDrive.stops)

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
        parsedStops.push(stopConverter.fromData(stop))
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
  fromData: function (data) {
    const parsedStops = []
    if (data.scheduledDrive.stops != undefined) {
      data.scheduledDrive.stops.forEach((stop) => {
        parsedStops.push(stopConverter.fromData(stop))
      })
    }
    return ScheduledDrive({
      start: data.scheduledDrive.start,
      end: data.scheduledDrive.end,
      workTrip: data.scheduledDrive.workTrip,
      takenSeats: data.scheduledDrive.takenSeats,
      stops: parsedStops,
    })
  },
}
