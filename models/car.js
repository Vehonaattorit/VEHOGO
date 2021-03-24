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
    return {
      driverName: car.driverName,
      registerNumber: car.registerNumber,
      carName: car.carName,
      availableSeats: car.availableSeats,
    }
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
