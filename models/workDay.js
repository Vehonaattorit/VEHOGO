import {ScheduledDrive, scheduleDriveConverter} from './scheduleDrive'

export class WorkDay {
  constructor({workDayNum, toWorkDrive, toHomeDrive, currentLocation}) {
    this.workDayNum = workDayNum
    this.toWorkDrive = toWorkDrive
    this.toHomeDrive = toHomeDrive
    this.currentLocation = currentLocation
  }
}

// Firestore data converter
export const workDayConverter = {
  toFirestore: function (workDay) {
    let workDayObject = {}
    if (workDayNum != undefined) {
      workDayObject.workDayNum = workDay.workDayNum
    }
    if (toWorkDrive != undefined) {
      workDayObject.toWorkDrive = scheduleDriveConverter.toFirestore(
        workDay.toWorkDrive
      )
    }
    if (toHomeDrive != undefined) {
      workDayObject.toHomeDrive = scheduleDriveConverter.toFirestore(
        workDay.toHomeDrive
      )
    }
    if (currentLocation != undefined) {
      workDayObject.currentLocation = workDay.currentLocation
    }
    return workDayObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new WorkDay({
      workDayNum: data.workDayNum,
      toWorkDrive: scheduleDriveConverter.fromFirestore(data.toWorkDrive),
      toHomeDrive: scheduleDriveConverter.fromFirestore(data.toHomeDrive),
      currentLocation: data.currentLocation,
    })
  },
}
