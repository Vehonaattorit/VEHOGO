export class Stop {
  constructor({location, address, stopName, userID, estimatedArrivalTime}) {
    this.location = location
    this.address = address
    this.stopName = stopName
    this.userID = userID
    this.estimatedArrivalTime = estimatedArrivalTime
  }
}

// Firestore data converter
export const stopConverter = {
  toFirestore: function (stop) {
    let stopObject = {}
    stopObject.location = stop.location
    stopObject.address = stop.address
    stopObject.stopName = stop.stopName
    stopObject.userID = stop.userID
    if (stop.estimatedArrivalTime != undefined) {
      stopObject.estimatedArrivalTime = stop.estimatedArrivalTime
    }

    console.log('stopObject-666', stopObject)

    return stopObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new Stop({
      location: data.location,
      address: data.address,
      stopName: data.stopName,
      userID: data.userID,
      estimatedArrivalTime: data.estimatedArrivalTime,
    })
  },
  fromData: function (data) {
    return new Stop({
      location: data.location,
      address: data.address,
      stopName: data.stopName,
      userID: data.userID,
      estimatedArrivalTime: data.estimatedArrivalTime,
    })
  },
}
