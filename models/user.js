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
    return {
      id: user.id,
      userName: user.userName,
      company: user.company,
      homeLocation: user.homeLocation,
      homeAddress: user.homeAddress,
      displayPhotoURL: user.displayPhotoURL,
      workDays: user.workDays,
      travelPreference: user.travelPreference,
      schoosedCarID: user.schoosedCarID,
      cars: user.cars,
    }
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new User({
      id: data.id,
      userName: data.userName,
      company: data.company,
      homeLocation: data.homeLocation,
      homeAddress: data.homeAddress,
      displayPhotoURL: data.displayPhotoURL,
      workDays: data.workDays,
      travelPreference: data.travelPreference,
      schoosedCarID: data.schoosedCarID,
      cars: data.cars,
    })
  },
}
