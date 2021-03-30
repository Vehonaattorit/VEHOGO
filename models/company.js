export class Company {
  constructor({id, displayName, location, address, userIDs, city, workTrips}) {
    this.id = id
    this.displayName = displayName
    this.location = location
    this.address = address
    this.userIDs = userIDs
    this.city = city
  }
}

// Firestore data converter
export const companyConverter = {
  toFirestore: function (company) {
    let companyObject = {}
    if (company.id != undefined) {
      companyObject.id = company.id
    }
    if (company.displayName != undefined) {
      companyObject.displayName = company.displayName
    }
    if (company.location != undefined) {
      companyObject.location = company.location
    }
    if (company.address != undefined) {
      companyObject.address = company.address
    }
    if (company.userIDs != undefined) {
      companyObject.userIDs = company.userIDs
    }
    if (company.city != undefined) {
      companyObject.city = company.city
    }
    return companyObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new Company({
      id: data.id,
      displayName: data.displayName,
      location: data.location,
      address: data.address,
      userIDs: data.userIDs,
      city: data.city
    })
  },
  fromData: function (data) {
    return new Company({
      id: data.id,
      displayName: data.displayName,
      location: data.location,
      address: data.address,
      userIDs: data.userIDs,
      city: data.city
    })
  },
}
