import {stopConverter, Stop} from './stop'

export class RideRequest {
  constructor({
    id,
    homeLocation,
    homeAddress,
    city,
    userName,
    userID,
    workTripRefID,
    driverID,
    workDayNum,
  }) {
    this.id = id
    this.homeLocation = homeLocation
    this.homeAddress = homeAddress
    this.city = city
    this.userName = userName
    this.userID = userID
    this.workTripRefID = workTripRefID
    this.driverID = driverID
    this.workDayNum = workDayNum
  }
}

// Firestore data converter
export const rideRequestConverter = {
  toFirestore: function (rideRequest) {
    let rideRequestObject = {}
    if (rideRequest.id != undefined) {
      rideRequestObject.id = rideRequest.id
    }
    if (rideRequest.homeLocation != undefined) {
      rideRequestObject.homeLocation = rideRequest.homeLocation
    }
    if (rideRequest.homeAddress != undefined) {
      rideRequestObject.homeAddress = rideRequest.homeAddress
    }
    if (rideRequest.city != undefined) {
      rideRequestObject.city = rideRequest.city
    }
    if (rideRequest.userName != undefined) {
      rideRequestObject.userName = rideRequest.userName
    }
    if (rideRequest.userID != undefined) {
      rideRequestObject.userID = rideRequest.userID
    }
    if (rideRequest.workTripRefID != undefined) {
      rideRequestObject.workTripRefID = rideRequest.workTripRefID
    }
    if (rideRequest.driverID != undefined) {
      rideRequestObject.driverID = rideRequest.driverID
    }
    if (rideRequest.workDayNum != undefined) {
      rideRequestObject.workDayNum = rideRequest.workDayNum
    }
    return rideRequestObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new RideRequest({
      id: data.id,
      homeLocation: data.homeLocation,
      homeAddress: data.homeAddress,
      city: data.city,
      userName: data.userName,
      userID: data.userID,
      workTripRefID: data.workTripRefID,
      driverID: data.driverID,
      workDayNum: data.workDayNum,
    })
  },
  fromData: function (data) {
    if (data == undefined) return undefined
    return new RideRequest({
      id: data.id,
      homeLocation: data.homeLocation,
      homeAddress: data.homeAddress,
      city: data.city,
      userName: data.userName,
      userID: data.userID,
      workTripRefID: data.workTripRefID,
      driverID: data.driverID,
      workDayNum: data.workDayNum,
    })
  },
}
