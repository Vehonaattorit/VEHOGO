import React, {useEffect, useContext, useState} from 'react'

import moment from 'moment'
import {UserContext} from '../contexts'

const useHomeOrWorkHook = () => {
  const [extraDay, setExtraDay] = useState([])
  const [goingTo, setGoingTo] = useState([])

  const fetchHomeOrWorkTrips = () => {
    const {user} = useContext(UserContext)

    const now = new Date(1970, 0, 1, 19, 0)

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

    setGoingTo(goingTo)
    // return {goingTo}
  }

  return {
    fetchHomeOrWorkTrips,
    extraDay,
    goingTo,
  }
}

export {useHomeOrWorkHook}
