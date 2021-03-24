export class Company {
  constructor({id, displayName, location, address, userIDs, workTrips}) {
    this.id = id
    this.displayName = displayName
    this.location = location
    this.address = address
    this.userIDs = userIDs
    this.workTrips = workTrips
  }
}

// Firestore data converter
export const companyConverter = {
  toFirestore: function (user) {
    return {
      displayName: company.displayName,
      location: company.location,
      address: company.address,
      userIDs: company.userIDs,
      workTrips: company.workTrips,
    }
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new Company({
      id: data.id,
      displayName: data.displayName,
      location: data.location,
      address: data.address,
      userIDs: data.userIDs,
      workTrips: data.workTrips,
    })
  },
}
