export class Stop {
  constructor({location, address, stopName, userID}) {
    this.location = location
    this.address = address
    this.stopName = stopName
    this.userID = userID
  }
}

// Firestore data converter
export const stopConverter = {
  toFirestore: function (stop) {
    return {
      location: stop.location,
      address: stop.address,
      stopName: stop.stopName,
      userID: stop.userID,
    }
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new Stop({
      location: data.location,
      address: data.address,
      stopName: data.stopName,
      userID: data.userID,
    })
  },
  fromData: function (data) {
    return new Stop({
      location: data.location,
      address: data.address,
      stopName: data.stopName,
      userID: data.userID,
    })
  },
}
