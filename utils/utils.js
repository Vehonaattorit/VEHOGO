import moment from 'moment-timezone'
import {googleMapsApiKey} from '../secrets/secrets'

// Firebase
import firebase from 'firebase'
import {updateUser, getUser} from '../controllers/userController'
import {updateWorkTrip} from '../controllers/workTripController'
import {ScheduledDrive} from '../models/scheduleDrive'
import {Stop} from '../models/stop'
import {WorkTrip} from '../models/workTrip'
// [END]

export const formatTime = (dateTime) => {
  console.log('datus', dateTime)
  return moment(dateTime).format('HH:mm')
}

export const checkWhatDayItIs = (dayNum) => {
  switch (String(dayNum)) {
    case '1':
      return 'Monday'
    case '2':
      return 'Tuesday'
    case '3':
      return 'Wednesday'
    case '4':
      return 'Thursday'
    case '5':
      return 'Friday'
    case '6':
      return 'Saturday'
    case '7':
      return 'Sunday'
    default:
      return 'Monday'
  }
}

export const getNextDayOfWeek = (date, dayOfWeek) => {
  // Code to check that date and dayOfWeek are valid left as an exercise ;)

  var resultDate = new Date(date.getTime())

  resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7))

  return resultDate
}

export const drivingTime = (workTrip) => {
  let totalTime = 0
  workTrip.route.routes[0].legs.map((leg) => {
    totalTime += leg.duration.value
  })
  return parseFloat((totalTime / 60).toFixed(0))
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the earth in km
  const dLat = degreesToRadius(lat2 - lat1) // deg2rad below
  const dLon = degreesToRadius(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadius(lat1)) *
      Math.cos(degreesToRadius(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

const degreesToRadius = (deg) => {
  return deg * (Math.PI / 180)
}

export const setupWorkTripDocs = async (user) => {
  const workTripDocuments = user.preferedWorkingHours.reduce(
    (res, current, index, array) => {
      return res.concat([current, current])
    },
    []
  )

  let userToUpdate = user
  workTripDocuments.forEach(async (item, i) => {
    let preferedWorkHourindex
    // Find the
    for (let i = 0; i < user.preferedWorkingHours.length; i++) {
      const element = user.preferedWorkingHours[i]
      if (element.workDayNum == item.workDayNum) {
        preferedWorkHourindex = i
      }
    }

    let index = i + 1

    let start =
      index % 2 === 0 ? item.workDayEnd.toDate() : item.workDayStart.toDate()

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${user.homeLocation.latitude},${user.homeLocation.longitude}&destination=${user.company.location.latitude},${user.company.location.longitude}&key=${googleMapsApiKey}`,
      {
        method: 'GET',
        //Request Type
      }
    )

    const responseJson = await response.json()

    const data = responseJson
    let totalTime = 0
    data.routes[0].legs.map((leg) => {
      totalTime += leg.duration.value
    })
    totalTime = parseFloat(totalTime.toFixed(0))

    let end =
      index % 2 === 0
        ? new Date(1970, 0, 1, item.workDayEnd.toDate().getHours(), 0)
        : new Date(1970, 0, 1, item.workDayStart.toDate().getHours(), 0)

    //adding ride time to end time and start depending on the total drive time
    index % 2 === 0
      ? (end = new Date(end.getTime() + totalTime * 1000))
      : (start = new Date(start.getTime() - totalTime * 1000))

    const goingTo = index % 2 === 0 ? 'home' : 'work'
    let initialStops = [
      new Stop({
        address: user.homeAddress,
        stopName: 'Home',
        userID: user.id,
        location: user.homeLocation,
      }),
      new Stop({
        location: user.company.location,
        address: user.company.address,
        stopName: user.company.name,
        userID: user.id,
      }),
    ]

    let workTripId = await updateWorkTrip(
      user.company.id, // Looks for company ID that user has joined
      new WorkTrip({
        driverName: user.userName,
        driverID: user.id,
        goingTo: goingTo,
        isDriving: false,
        route: data,
        currentLocation: user.homeAddress,
        workDayNum: item.workDayNum,
        scheduledDrive: new ScheduledDrive({
          start: new firebase.firestore.Timestamp.fromDate(start),
          end: new firebase.firestore.Timestamp.fromDate(end),
          availableSeats: 0,
          stops: goingTo == 'work' ? initialStops : initialStops.reverse(),
          nextStop: 1,
        }),
      })
    )

    if (goingTo == 'work') {
      userToUpdate.preferedWorkingHours[
        preferedWorkHourindex
      ].toWorkRefID = workTripId
    } else {
      userToUpdate.preferedWorkingHours[
        preferedWorkHourindex
      ].toHomeRefID = workTripId
    }

    await updateUser(userToUpdate)
  })
}
