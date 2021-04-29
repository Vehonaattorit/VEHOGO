import {ScheduledDrive, scheduleDriveConverter} from './scheduleDrive'

export class PreferedWorkingHours {
  constructor({
    workDayNum,
    recomendedToHomeTripRefId,
    recomendedToWorkTripRefId,
    toWorkRefID,
    toHomeRefID,
    workDayStart,
    workDayEnd,
  }) {
    this.workDayNum = workDayNum
    this.workDayStart = workDayStart
    this.toWorkRefID = toWorkRefID
    this.recomendedToHomeTripRefId = recomendedToHomeTripRefId
    this.recomendedToWorkTripRefId = recomendedToWorkTripRefId
    this.toHomeRefID = toHomeRefID
    this.workDayEnd = workDayEnd
  }
}

// Firestore data converter
export const preferedWorkingHoursConverter = {
  toFirestore: function (preferedWorkingHours) {
    let preferedWorkingHouresObject = {}
    if (preferedWorkingHours.workDayNum != undefined) {
      preferedWorkingHouresObject.workDayNum = preferedWorkingHours.workDayNum
    }
    if (preferedWorkingHours.toWorkRefID != undefined) {
      preferedWorkingHouresObject.toWorkRefID = preferedWorkingHours.toWorkRefID
    }
    if (preferedWorkingHours.toHomeRefID != undefined) {
      preferedWorkingHouresObject.toHomeRefID = preferedWorkingHours.toHomeRefID
    }
    if (preferedWorkingHours.workDayEnd != undefined) {
      preferedWorkingHouresObject.workDayEnd = preferedWorkingHours.workDayEnd
    }
    if (preferedWorkingHours.workDayStart != undefined) {
      preferedWorkingHouresObject.workDayStart = preferedWorkingHours.workDayStart
    }
    return preferedWorkingHouresObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new PreferedWorkingHours({
      workDayNum: data.workDayNum,
      toWorkRefID: data.toWorkRefID,
      recomendedToHomeTripRefId: data.recomendedToHomeTripRefId,
      recomendedToWorkTripRefId: data.recomendedToWorkTripRefId,
      toHomeRefID: data.toHomeRefID,
      workDayStart: data.workDayStart,
      workDayEnd: data.workDayEnd,
    })
  },
  fromData: function (data) {
    if (data == undefined) return undefined
    return new PreferedWorkingHours({
      workDayNum: data.workDayNum,
      toWorkRefID: data.toWorkRefID,
      toHomeRefID: data.toHomeRefID,
      recomendedToHomeTripRefId: data.recomendedToHomeTripRefId,
      recomendedToWorkTripRefId: data.recomendedToWorkTripRefId,
      workDayStart: data.workDayStart,
      workDayEnd: data.workDayEnd,
    })
  },
}
