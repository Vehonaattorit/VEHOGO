import moment from 'moment-timezone'

export const formatTime = (dateTime) => {
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
