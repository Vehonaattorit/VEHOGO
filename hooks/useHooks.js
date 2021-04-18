import React, {useEffect, useContext, useState} from 'react'
import moment from 'moment'

import {
  workTripMultiQuery,
  workTripOrderByQuery,
} from '../controllers/workTripController'

import firebase from 'firebase/app'

const useWorkTripHooks = (user) => {
  const [isLoading, setIsLoading] = useState(false)

  //PASSENGER
  const [multiSliderValue, setMultiSliderValue] = useState([540, 1020])
  const [extraDay, setExtraDay] = useState([])
  const [passengerList, setPassengerList] = useState(null)
  const [open, setOpen] = useState(false)
  const [activeRide, setActiveRide] = useState(null)

  //DRIVER
  const [driverTripList, setDriverTripList] = useState(null)

  const [timeValues, setTimeValues] = useState([
    {hours: '8', minutes: '00'},
    {hours: '17', minutes: '00'},
  ])

  const fetchHomeOrWorkTrips = (currentWeekDay) => {
    // const now = new Date().getDay()

    const workDayEnd = user.preferedWorkingHours[0].workDayEnd.toDate()

    let goingTo
    if (
      moment(currentWeekDay).isBetween(new Date(1970, 0, 1, 0, 0), workDayEnd)
    ) {
      goingTo = 'work'
    } else if (
      moment(currentWeekDay).isBetween(workDayEnd, new Date(1970, 0, 1, 19, 0))
    ) {
      goingTo = 'home'
    } else {
      goingTo = 'work'

      setExtraDay('1')
    }

    return goingTo
  }

  const multiSliderValuesChange = (values) => {
    setMultiSliderValue(values)

    slideTime()
  }

  const queryWithTime = async () => {
    setIsLoading(true)

    // const currentWeekDay = new Date().getDay()fetchHomeOrWorkTrips

    const currentWeekDay = 5

    const goingTo = fetchHomeOrWorkTrips(currentWeekDay)

    const query = await workTripMultiQuery(user.company.id, [
      {
        field: 'scheduledDrive.start',
        condition: '>=',
        value: new Date(1970, 0, 1, timeValues[0].hours, timeValues[0].minutes),
      },
      {
        field: 'scheduledDrive.start',
        condition: '<=',
        value: new Date(1970, 0, 1, timeValues[1].hours, timeValues[1].minutes),
      },
      // {field: 'workDayNum', condition: '==', value: currentWeekDay},
      {field: 'goingTo', condition: '==', value: goingTo},
    ])

    setOpen(!open)
    setIsLoading(false)
    setPassengerList(query)
  }

  const fetchTodayRides = async () => {
    setIsLoading(true)

    // const currentWeekDay = new Date().getDay()

    const currentWeekDay = 5

    const goingTo = fetchHomeOrWorkTrips(currentWeekDay)

    const activeRide = await workTripMultiQuery(user.company.id, [
      {
        field: 'scheduledDrive.stops',
        condition: 'array-contains',
        value: {
          address: user.homeAddress,
          location: user.homeLocation,
          stopName: user.userName,
          userID: user.id,
        },
      },
      {field: 'workDayNum', condition: '==', value: currentWeekDay},
      {field: 'isDriving', condition: '==', value: true},
    ])

    if (activeRide[0] === undefined) {
      setActiveRide(null)

      setIsLoading(false)
    } else {
      setActiveRide(activeRide[0])
    }

    // Passenger List
    const query = await workTripOrderByQuery(user.company.id, [
      {field: 'workDayNum', condition: '==', value: currentWeekDay},
      {field: 'goingTo', condition: '==', value: goingTo},
    ])

    setIsLoading(false)

    setPassengerList(query)
  }

  const slideTime = () => {
    let val0 = multiSliderValue[0]
    let val1 = multiSliderValue[1]
    let minutes0 = parseInt(val0 % 60, 10)
    let hours0 = parseInt((val0 / 60) % 24, 10)
    let minutes1 = parseInt(val1 % 60, 10)
    let hours1 = parseInt((val1 / 60) % 24, 10)

    let startTime = getTime(hours0, minutes0)

    let endTime = getTime(hours1, minutes1)

    setTimeValues([startTime, endTime])

    return {startTime, endTime}
  }

  const getTime = (hours, minutes) => {
    var time = null
    minutes = minutes + ''

    if (minutes.length == 1) {
      minutes = '0' + minutes
    }

    return {hours, minutes}
  }

  //DRIVER SPECIFIC FUNCTIONS STARTS HERE

  return {
    multiSliderValuesChange,
    multiSliderValue,
    timeValues,
    open,
    setOpen,
    extraDay,
    isLoading,

    //Passenger
    queryWithTime,
    fetchTodayRides,
    passengerList,
    activeRide,

    //Driver
    driverTripList,
    setDriverTripList,
  }
}

export {useWorkTripHooks}
