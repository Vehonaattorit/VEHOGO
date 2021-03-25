import {WorkDay, workDayConverter} from './workDay'

export class User {
  constructor({
    id,
    userName: userName,
    company,
    homeLocation,
    homeAddress,
    displayPhotoURL,
    workDays,
    travelPreference,
    schoosedCarID,
    cars,
  }) {
    this.id = id
    this.userName = userName
    this.company = company
    this.homeLocation = homeLocation
    this.homeAddress = homeAddress
    this.displayPhotoURL = displayPhotoURL
    this.workDays = workDays
    this.travelPreference = travelPreference
    this.schoosedCarID = schoosedCarID
    this.cars = cars
  }
}

// Firestore data converter
export const userConverter = {
  toFirestore: function (user) {
    let userObject = {}
    if (user.id != undefined) {
      userObject.id = user.id
    }
    if (user.userName != undefined) {
      userObject.userName = user.userName
    }
    if (user.company != undefined) {
      userObject.company = user.company
    }
    if (user.homeLocation != undefined) {
      userObject.homeLocation = user.homeLocation
    }
    if (user.homeAddress != undefined) {
      userObject.homeAddress = user.homeAddress
    }
    if (user.displayPhotoURL != undefined) {
      userObject.displayPhotoURL = user.displayPhotoURL
    }
    if (user.workDays != undefined && user.workDays.size > 0) {
      const workDays = []
      user.workDays.forEach((workDay) => {
        workDays.push(workDayConverter.toFirestore(workDay))
      })
      userObject.workDays = workDays
    }
    if (user.travelPreference != undefined) {
      userObject.travelPreference = user.travelPreference
    }
    if (user.schoosedCarID != undefined) {
      userObject.schoosedCarID = user.schoosedCarID
    }
    if (user.cars != undefined) {
      userObject.cars = user.cars
    }
    return userObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    const parsedWorkDays = []
    data.workDays.forEach((workDay) => {
      parsedWorkDays.push(workDayConverter.fromFirestore(workDay))
    })

    return new User({
      id: data.id,
      userName: data.userName,
      company: data.company,
      homeLocation: data.homeLocation,
      homeAddress: data.homeAddress,
      displayPhotoURL: data.displayPhotoURL,
      workDays: parsedWorkDays,
      travelPreference: data.travelPreference,
      schoosedCarID: data.schoosedCarID,
    })
  },
}
