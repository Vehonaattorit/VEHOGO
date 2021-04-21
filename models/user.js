import {preferedWorkingHoursConverter} from './preferedWorkingHours'

export class User {
  constructor({
    id,
    expoToken,
    userName,
    company,
    homeLocation,
    homeAddress,
    city,
    displayPhotoURL,
    travelPreference,
    schoosedCarID,
    cars,
    preferedWorkingHours,
    setupIsCompleted,
    phoneNumber,
    fullName,
    email,
  }) {
    this.id = id
    this.expoToken = expoToken
    this.userName = userName
    this.company = company
    this.homeLocation = homeLocation
    this.homeAddress = homeAddress
    this.city = city
    this.displayPhotoURL = displayPhotoURL
    this.travelPreference = travelPreference
    this.schoosedCarID = schoosedCarID
    this.cars = cars
    this.preferedWorkingHours = preferedWorkingHours
    this.setupIsCompleted = setupIsCompleted
    this.phoneNumber = phoneNumber
    this.fullName = fullName
    this.email = email
  }
}

// Firestore data converter
export const userConverter = {
  toFirestore: function (user) {
    let userObject = {}
    if (user.id != undefined) {
      userObject.id = user.id
    }
    if (user.expoToken != undefined) {
      userObject.expoToken = user.expoToken
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
      let hours = []
      user.preferedWorkingHours.forEach((workingHours) => {
        hours.push(preferedWorkingHoursConverter.toFirestore(workingHours))
      })

      userObject.preferedWorkingHours = user.preferedWorkingHours
    }
    if (user.setupIsCompleted != undefined) {
      userObject.setupIsCompleted = user.setupIsCompleted
    }
    if (user.phoneNumber != undefined) {
      userObject.phoneNumber = user.phoneNumber
    }
    if (user.fullName != undefined) {
      userObject.fullName = user.fullName
    }
    if (user.email != undefined) {
      userObject.email = user.email
    }

    return userObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    let hours = undefined
    if (data.preferedWorkingHours != undefined) {
      hours = []
      data.preferedWorkingHours.forEach((hour) => {
        hours.push(preferedWorkingHoursConverter.fromData(hour))
      })
    }
    return new User({
      id: data.id,
      expoToken: data.expoToken,
      userName: data.userName,
      company: data.company,
      homeLocation: data.homeLocation,
      homeAddress: data.homeAddress,
      city: data.city,
      displayPhotoURL: data.displayPhotoURL,
      travelPreference: data.travelPreference,
      schoosedCarID: data.schoosedCarID,
      preferedWorkingHours: data.preferedWorkingHours,
      setupIsCompleted: data.setupIsCompleted,
      phoneNumber: data.phoneNumber,
      fullName: data.fullName,
      email: data.email,
    })
  },
}
