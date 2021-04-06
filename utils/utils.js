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

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = degreesToRadius(lat2 - lat1); // deg2rad below
  const dLon = degreesToRadius(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadius(lat1)) * Math.cos(degreesToRadius(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const degreesToRadius = (deg) => {
  return deg * (Math.PI / 180);
};



