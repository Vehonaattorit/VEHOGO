import {WorkDay, workDayConverter} from './workDay'

export class User {
  constructor({
    id,
    userName,
    company,
    homeLocation,
    homeAddress,
    city,
    displayPhotoURL,
    workDays,
    travelPreference,
    schoosedCarID,
    cars,
    preferedWorkingHours,
    setupIsCompleted,
  }) {
    this.id = id
    this.userName = userName
    this.company = company
    this.homeLocation = homeLocation
    this.homeAddress = homeAddress
    this.city = city
    this.displayPhotoURL = displayPhotoURL
    this.workDays = workDays
    this.travelPreference = travelPreference
    this.schoosedCarID = schoosedCarID
    this.cars = cars
    this.preferedWorkingHours = preferedWorkingHours
    this.setupIsCompleted = setupIsCompleted
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

    if (user.city != undefined) {
      userObject.city = user.city
    }
    if (user.displayPhotoURL != undefined) {
      userObject.displayPhotoURL = user.displayPhotoURL
    }
    if (user.workDays != undefined) {
      userObject.workDays = user.workDays
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
    if (user.preferedWorkingHours != undefined) {
      userObject.preferedWorkingHours = user.preferedWorkingHours
    }
    if (user.setupIsCompleted != undefined) {
      userObject.setupIsCompleted = user.setupIsCompleted
    }
    return userObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)

    console.log('user data company', data)

    return new User({
      id: data.id,
      userName: data.userName,
      company: data.company,
      homeLocation: data.homeLocation,
      homeAddress: data.homeAddress,
      city: data.city,
      displayPhotoURL: data.displayPhotoURL,
      workDays: data.workDays,
      travelPreference: data.travelPreference,
      schoosedCarID: data.schoosedCarID,
      preferedWorkingHours: data.preferedWorkingHours,
      setupIsCompleted: data.setupIsCompleted,
    })
  },
}
