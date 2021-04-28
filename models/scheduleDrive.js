import {stopConverter, Stop} from './stop'

export class ScheduledDrive {
  constructor({id, start, end, workTrip, availableSeats, stops, nextStop}) {
    this.start = start
    this.end = end
    this.availableSeats = availableSeats
    this.stops = stops
    this.nextStop = nextStop
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
    if (scheduledDrive.availableSeats != undefined) {
      scheduledDriveObject.availableSeats = scheduledDrive.availableSeats - 1
    }
    if (scheduledDrive.stops != undefined && scheduledDrive.stops.length > 0) {
      const stops = []

      scheduledDrive.stops.forEach((stop) => {
        stops.push(stopConverter.toFirestore(stop))
      })
      scheduledDriveObject.stops = stops
    }
    if (scheduledDrive.nextStop != undefined) {
      scheduledDriveObject.nextStop = scheduledDrive.nextStop
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
      availableSeats: data.availableSeats,
      stops: parsedStops,
      nextStop: data.nextStop,
    })
  },
  fromData: function (data) {
    const parsedStops = []
    let startTime = new Date()
    let endTime = new Date()
    if (data != undefined) {
      if (data.stops != undefined) {
        data.stops.forEach((stop) => {
          parsedStops.push(stopConverter.fromData(stop))
        })
      }
      try {
        if (data.start != undefined && data.end != undefined) {
          startTime = data.start
          endTime = data.end
        }
      } catch (error) {}
      return new ScheduledDrive({
        start: startTime,
        end: endTime,
        workTrip: data.workTrip,
        availableSeats: data.availableSeats,
        stops: parsedStops,
        nextStop: data.nextStop,
      })
    } else return undefined
  },
}
