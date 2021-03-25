export class Car {
  constructor({id, driverName, registerNumber, carName, availableSeats}) {
    this.id = id
    this.driverName = driverName
    this.registerNumber = registerNumber
    this.carName = carName
    this.availableSeats = availableSeats
  }
}

// Firestore data converter
export const carConverter = {
  toFirestore: function (car) {
    let carObject = {}
    if (car.driverName != undefined) {
      carObject.driverName = car.driverName
    }
    if (car.registerNumber != undefined) {
      carObject.registerNumber = car.registerNumber
    }
    if (car.carName != undefined) {
      carObject.carName = car.carName
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
      carName: data.carName,
      availableSeats: data.availableSeats,
    })
  },
}
