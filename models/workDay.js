import {ScheduledDrive, scheduleDriveConverter} from './scheduleDrive'

export class WorkDay {
  constructor({workDayNum, toWorkDrive, toHomeDrive, currentLocation}) {
    this.workDayNum = workDayNum
    this.toWorkRefID = toWorkDrive
    this.toHomeRefID = toHomeDrive
  }
}

// Firestore data converter
export const workDayConverter = {
  toFirestore: function (workDay) {
    let workDayObject = {}
    if (workDay.workDayNum != undefined) {
      workDayObject.workDayNum = workDay.workDayNum
    }
    if (workDay.toWorkDrive != undefined) {
      workDayObject.toWorkRefID = workDay.toWorkRefID
    }
    if (workDay.toHomeDrive != undefined) {
      workDayObject.toHomeRefID = workDay.toHomeRefID
    }
    return workDayObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new WorkDay({
      workDayNum: data.workDayNum,
      toWorkRefID: data.toWorkRefID,
      toHomeRefID: data.toHomeRefID,
    })
  },
}
