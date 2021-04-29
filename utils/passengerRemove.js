import {calculateDistance} from '../utils/utils'
import {
  updateWorkTrip,
} from '../controllers/workTripController'
import {googleMapsApiKey} from '../secrets/secrets'

export const removePassengerFromRoute = async(workTripUpdate, companyId, workTrip) => {
  let route = []
  if (workTripUpdate.scheduledDrive.stops.length > 2) {
    console.log('more than 2 stops still left')
    var tempStops = workTripUpdate.scheduledDrive.stops
    var waypoints = tempStops.slice(1, tempStops.length - 1)

    //calculates distances between origin and stop locations
    waypoints.forEach((waypoint) => {
      var firstStop = workTripUpdate.scheduledDrive.stops[0]
      waypoint.distanceFromOrigin = calculateDistance(
        firstStop.location.latitude,
        firstStop.location.longitude,
        waypoint.location.latitude,
        waypoint.location.longitude
      )
    })
    //waypoints sorted by distance between origin
    waypoints.sort(function (origin, stop) {
      return origin.distanceFromOrigin - stop.distanceFromOrigin
    })

    route = await getTripRoute(waypoints, workTrip)
    //add old first and last stops to the new array
    waypoints.unshift(workTripUpdate.scheduledDrive.stops[0])
    waypoints.push(
      workTripUpdate.scheduledDrive.stops[
      workTripUpdate.scheduledDrive.stops.length - 1
      ]
    )

  } else {
    //if there is only driver home and work just get route between those places
    //getTripRoute function has driver locations already defined
    route = await getTripRoute([], workTrip)

  }
  workTripUpdate.route = route

  await updateWorkTrip(companyId, workTripUpdate)

}

export const getTripRoute = async (waypoints, workTrip) => {
  try {
    const origin = workTrip.scheduledDrive.stops[0].location
    const destination =
      workTrip.scheduledDrive.stops[workTrip.scheduledDrive.stops.length - 1]
        .location
    var waypointsString = ''
    if (waypoints.length > 0) {
      waypointsString = '&waypoints='
      waypoints.forEach((waypoint) => {
        waypointsString += `${waypoint.location.latitude},${waypoint.location.longitude}|`
      })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&${waypointsString}&key=${googleMapsApiKey}`,
      {
        method: 'GET',
        //Request Type
      }
    )

    const responseJson = await response.json()

    const data = responseJson

    return data
  } catch (e) {
    console.error(e)
  }
}
