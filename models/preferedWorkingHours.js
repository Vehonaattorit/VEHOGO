import {ScheduledDrive, scheduleDriveConverter} from './scheduleDrive'

export class PreferedWorkingHours {
  constructor({
    workDayNum,
    toWorkRefID,
    toHomeRefID,
    workDayStart,
    workDayEnd,
  }) {
    this.workDayNum = workDayNum
    this.workDayStart = workDayStart
    this.toWorkRefID = toWorkRefID
    this.toHomeRefID = toHomeRefID
    this.workDayEnd = workDayEnd
  }
}

// Firestore data converter
export const preferedWorkingHoursConverter = {
  toFirestore: function (workDay) {
    let workDayObject = {}
    if (workDay.workDayNum != undefined) {
      workDayObject.workDayNum = workDay.workDayNum
    }
    if (workDay.toWorkRefID != undefined) {
      workDayObject.toWorkRefID = workDay.toWorkRefID
    }
    if (workDay.toHomeRefID != undefined) {
      workDayObject.toHomeRefID = workDay.toHomeRefID
    }
    if (workDay.workDayEnd != undefined) {
      workDayObject.workDayEnd = workDay.workDayEnd
    }
    if (workDay.workDayStart != undefined) {
      workDayObject.workDayStart = workDay.workDayStart
    }
    return workDayObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new PreferedWorkingHours({
      workDayNum: data.workDayNum,
      toWorkRefID: data.toWorkRefID,
      toHomeRefID: data.toHomeRefID,
      workDayStart: data.workDayStart,
      workDayEnd: data.workDayEnd,
    })
  },
  fromData: function (data) {
    return new PreferedWorkingHours({
      workDayNum: data.workDayNum,
      toWorkRefID: data.toWorkRefID,
      toHomeRefID: data.toHomeRefID,
      workDayStart: data.workDayStart,
      workDayEnd: data.workDayEnd,
    })
  },
}
