export class Stop {
  constructor({location, address, stopName, userID, latLng}) {
    this.location = location
    this.address = address
    this.stopName = stopName
    this.userID = userID
    this.latLng = latLng
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
      latLng: stop.latLng,
    }
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new Stop({
      location: data.location,
      address: data.address,
      stopName: data.stopName,
      userID: data.userID,
      latLng: data.latLng,
    })
  },
  fromData: function (data) {
    return new Stop({
      location: data.location,
      address: data.address,
      stopName: data.stopName,
      userID: data.userID,
      latLng: data.latLng,
    })
  },
}
