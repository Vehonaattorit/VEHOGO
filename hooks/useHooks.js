import React, {useEffect, useContext, useState} from 'react'
import moment from 'moment'

import {
  workTripMultiQuery,
  workTripOrderByQuery,
} from '../controllers/workTripController'

const useWorkTripHooks = (user) => {
  //PASSENGER
  const [multiSliderValue, setMultiSliderValue] = useState([540, 1020])
  const [extraDay, setExtraDay] = useState([])
  const [passengerList, setPassengerList] = useState(null)
  const [open, setOpen] = useState(false)

  //DRIVER
  const [driverTripList, setDriverTripList] = useState(null)

  const [timeValues, setTimeValues] = useState([
    {hours: '8', minutes: '00'},
    {hours: '17', minutes: '00'},
  ])

  const fetchHomeOrWorkTrips = () => {
    const now = new Date().getDay()

    const workDayEnd = user.preferedWorkingHours[0].workDayEnd.toDate()

    let goingTo
    if (moment(now).isBetween(new Date(1970, 0, 1, 0, 0), workDayEnd)) {
      goingTo = 'work'
    } else if (moment(now).isBetween(workDayEnd, new Date(1970, 0, 1, 19, 0))) {
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
    const currentWeekDay = new Date().getDay()

    const goingTo = fetchHomeOrWorkTrips()

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

    setPassengerList(query)

    setOpen(!open)
  }

  const fetchTodayRides = async () => {
    const currentWeekDay = new Date().getDay()

    const goingTo = fetchHomeOrWorkTrips()

    const query = await workTripOrderByQuery(user.company.id, [
      {field: 'workDayNum', condition: '==', value: currentWeekDay},
      {field: 'goingTo', condition: '==', value: goingTo},
    ])

    setPassengerList(query)
  }

  // const perkele = jotain

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

  const queryWithTimeAndDriverId = async () => {

    const goingTo = fetchHomeOrWorkTrips()
    console.log(user.id)
    console.log(user.company.id)
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

      {
        field: 'driverID',
        condition: '==',
        value: user.id
      },
      // {field: 'workDayNum', condition: '==', value: currentWeekDay},
      {
        field: 'goingTo',
        condition: '==',
        value: goingTo
      },
    ])

    console.log(query)

    setDriverTripList(query)

    setOpen(!open)
  }

  const fetchTodayDriverRides = async () => {
    const currentWeekDay = new Date().getDay()

    const goingTo = fetchHomeOrWorkTrips()
    console.log(user.id)
    console.log(user.company.id)
    const query = await workTripOrderByQuery(user.company.id, [
      {field: 'workDayNum', condition: '==', value: currentWeekDay},
      {field: 'goingTo', condition: '==', value: goingTo},
      {field: 'driverID', condition: '==', value: user.id}
    ])

    console.log(query)

    setDriverTripList(query)
  }

  return {
    multiSliderValuesChange,
    multiSliderValue,
    timeValues,
    open,
    setOpen,
    extraDay,

    //Passenger
    queryWithTime,
    fetchTodayRides,
    passengerList,

    //Driver
    queryWithTimeAndDriverId,
    fetchTodayDriverRides,
    driverTripList,

  }
}

export {useWorkTripHooks}
