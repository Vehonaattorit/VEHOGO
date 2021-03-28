import moment from 'moment-timezone'

export const formatTime = (dateTime) => {
  return moment(dateTime).format('HH:mm')
}
