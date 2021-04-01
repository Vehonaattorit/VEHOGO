import {stopConverter, Stop} from './stop'

export class RideRequest {
  constructor({
    id,
    homeLocation,
    homeAddress,
    city,
    userName,
    senderId,
    workTripRefID,
    driverID,
    workDayNum,
    pushToken,
    rideRequestPushToken,
  }) {
    this.id = id
    this.homeLocation = homeLocation
    this.homeAddress = homeAddress
    this.city = city
    this.userName = userName
    this.senderId = senderId
    this.workTripRefID = workTripRefID
    this.driverID = driverID
    this.workDayNum = workDayNum
    this.pushToken = pushToken
    this.rideRequestPushToken = rideRequestPushToken
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
    if (rideRequest.senderId != undefined) {
      rideRequestObject.senderId = rideRequest.senderId
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
    if (rideRequest.pushToken != undefined) {
      rideRequestObject.pushToken = rideRequest.pushToken
    }
    if (rideRequest.rideRequestPushToken != undefined) {
      rideRequestObject.rideRequestPushToken = rideRequest.rideRequestPushToken
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
      senderId: data.senderId,
      workTripRefID: data.workTripRefID,
      driverID: data.driverID,
      workDayNum: data.workDayNum,
      pushToken: data.pushToken,
      rideRequestPushToken: data.rideRequestPushToken,
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
      senderId: data.senderId,
      workTripRefID: data.workTripRefID,
      driverID: data.driverID,
      workDayNum: data.workDayNum,
      pushToken: data.pushToken,
      rideRequestPushToken: data.rideRequestPushToken,
    })
  },
}
