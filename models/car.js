export class Car {
  constructor({
    id,
    driverName,
    registerNumber,
    vehicleDescription,
    availableSeats,
  }) {
    this.id = id
    this.driverName = driverName
    this.registerNumber = registerNumber
    this.vehicleDescription = vehicleDescription
    this.availableSeats = availableSeats
  }
}

// Firestore data converter
export const carConverter = {
  toFirestore: function (car) {
    let carObject = {}
    if (car.id != undefined) {
      carObject.id = car.id
    }
    if (car.driverName != undefined) {
      carObject.driverName = car.driverName
    }
    if (car.registerNumber != undefined) {
      carObject.registerNumber = car.registerNumber
    }
    if (car.vehicleDescription != undefined) {
      carObject.vehicleDescription = car.vehicleDescription
    }
    if (car.availableSeats != undefined) {
      carObject.availableSeats = car.availableSeats
    }
    return carObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new Car({
      id: data.id,
      driverName: data.driverName,
      registerNumber: data.registerNumber,
      vehicleDescription: data.vehicleDescription,
      availableSeats: data.availableSeats,
    })
  },
  fromData: function (data) {
    if (data != undefined) {
      return Car({
        id: data.car.id,
        driverName: data.car.driverName,
        registerNumber: data.car.registerNumber,
        carName: data.car.carName,
        availableSeats: data.car.availableSeats,
      })
    }

    return undefined
  },
}
