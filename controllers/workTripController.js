import React, {useState, useEffect} from 'react'
import firebase from 'firebase/app'
import {v4} from 'uuid/v4'
import {workTripConverter, WorkTrip} from '../models/workTrip'
import 'firebase/firestore'

const db = firebase.firestore()

export const useIsDrivingHook = (user, workTrip) => {
  const [isDriving, setIsDriving] = useState(true)

  useEffect(() => {
    const fetchIsDriving = async () => {
      const isDrivingListener = await db
        .collection('companys')
        .doc(user.company.id)
        .collection('workTrips')
        .doc(workTrip.id)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.data()

          setIsDriving(data.isDriving)
        })

      return () => isDrivingListener()
    }
    fetchIsDriving()
  }, [])

  return {isDriving}
}

export const usePassengerListHook = (user, querys) => {
  const [passengerTrips, setWorkTrips] = useState([])
  const [activeRide, setActiveRide] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorkTrips = async () => {
      const workTripsListener = await db
        .collection('companys')
        .doc(user.company.id)
        .collection('workTrips')
        // DOESN'T WORK WITH onSnapshot
        // .withConverter(workTripConverter)
        .orderBy('workDayNum', 'asc')
        .orderBy('scheduledDrive.start', 'asc')
        .onSnapshot((querySnapshot) => {
          const passengerTrips = querySnapshot.docs.map((doc) => {
            return {
              ...doc.data(),
            }
          })

          const newPassengerTrips = []
          for (const passengerTrip of passengerTrips) {
            const isPassengerIncluded = passengerTrip.scheduledDrive.stops.some(
              (item) => {
                return item.userID === user.id
              }
            )

            newPassengerTrips.push({...passengerTrip, isPassengerIncluded})
          }

          setWorkTrips(newPassengerTrips)

          setIsLoading(false)
        })

      return () => workTripsListener()
    }

    const fetchActiveRide = async () => {
      console.log('fetchActiveRide')
      let activeRideListener = await db
        .collection('companys')
        .doc(user.company.id)
        .collection('workTrips')

      querys.forEach((query) => {
        activeRideListener = activeRideListener.where(
          query.field,
          query.condition,
          query.value
        )
      })

      activeRideListener.onSnapshot((querySnapshot) => {
        const activeRides = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
          }
        })

        if (activeRides[0] === undefined) {
          setActiveRide(null)
        } else {
          setActiveRide(activeRides[0])
        }

        setIsLoading(false)
      })

      return () => activeRideListener()
    }

    fetchWorkTrips()
    fetchActiveRide()
  }, [])

  return {
    passengerTrips,
    activeRide,
    isLoading,
  }
}

export const useDriverTripListHook = (user, querys) => {
  const [driverTrips, setWorkTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorkTrips = async () => {
      let workTripsListener = await db
        .collection('companys')
        .doc(user.company.id)
        .collection('workTrips')

      querys.forEach((query) => {
        workTripsListener = workTripsListener.where(
          query.field,
          query.condition,
          query.value
        )
      })

      workTripsListener.onSnapshot((querySnapshot) => {
        const driverTrips = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
          }
        })

        setWorkTrips(driverTrips)
        setIsLoading(false)
        console.log('loading false')
      })

      return () => {
        workTripsListener()
      }
    }

    fetchWorkTrips()
  }, [])

  return {
    driverTrips,
    isLoading,
  }
}

export async function updateWorkTrip(companyId, workTrip) {
  try {
    if (workTrip.id == undefined) {
      workTrip.id = v4()
    }
    // Add a new document in collection "users"
    let workDayRef = db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .doc(workTrip.id)

    workDayRef.withConverter(workTripConverter).set(workTrip, {merge: true})
    return workTrip.id
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getWorkTrip(companyId, workTripId) {
  try {
    // Add a new document in collection "users"
    let doc = await db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .doc(workTripId)
      .withConverter(workTripConverter)
      .get()
    return doc.data()
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function getWorkTrips(companyId) {
  try {
    // Add a new document in collection "users"
    let snapShot = await db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .withConverter(workTripConverter)
      .get()
    const workTripList = []
    snapShot.forEach((doc) => {
      const data = doc.data()

      workTripList.push(workTripConverter.fromData(data))
    })
    return workTripList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export function workTripStream(companyId, workTripId) {
  try {
    // Add a new document in collection "users"
    let ref = db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .doc(workTripId)
      .withConverter(workTripConverter)

    return ref
  } catch (error) {
    console.error('Error getting document stream: ', error)
    return
  }
}

export async function workTripOrderByQuery(companyId, querys) {
  try {
    // Add a new document in collection "users"
    let queryRef = await db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .withConverter(workTripConverter)

    querys.forEach((query) => {
      queryRef = queryRef.where(query.field, query.condition, query.value)
    })
    let query = await queryRef.orderBy('scheduledDrive.start').limit(3).get()
    const workTripList = []
    query.forEach((doc) => {
      workTripList.push(workTripConverter.fromData(doc.data()))
    })

    return workTripList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function workTripMultiQuery(companyId, querys) {
  try {
    // Add a new document in collection "users"
    let queryRef = await db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .withConverter(workTripConverter)

    querys.forEach((query) => {
      queryRef = queryRef.where(query.field, query.condition, query.value)
    })
    let query = await queryRef.get()
    const workTripList = []
    query.forEach((doc) => {
      workTripList.push(workTripConverter.fromData(doc.data()))
    })
    return workTripList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function workTripOrder(companyId) {
  try {
    // Add a new document in collection "users"
    let snapShot = await db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .withConverter(workTripConverter)
      .orderBy('workDayNum', 'asc')
      .orderBy('scheduledDrive.start', 'asc')
      .get()
    const workTripList = []
    snapShot.forEach((doc) => {
      const data = doc.data()

      workTripList.push(workTripConverter.fromData(data))
    })
    return workTripList
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}

export async function workTripMultiQueryStream(companyId, querys) {
  try {
    // Add a new document in collection "users"
    let queryRef = db
      .collection('companys')
      .doc(companyId)
      .collection('workTrips')
      .withConverter(workTripConverter)

    querys.forEach((query) => {
      queryRef = queryRef.where(query.field, query.condition, query.value)
    })

    return queryRef
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}
