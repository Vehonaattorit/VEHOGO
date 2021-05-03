import React, {useEffect, useState, useContext} from 'react'
import {View, Text, FlatList} from 'react-native'
import {SuggestedTripsListItem} from '../components/SuggestedTripsListItem'
import {workTripMultiQuery} from '../controllers/workTripController'
import {UserContext} from '../contexts'


export const SuggestedRides = ({navigation, route}) => {

  const {
    workDayNum,
    workTripType,
    startTime
  } = route.params
  const {user} = useContext(UserContext)
  const [trips, setTrips] = useState([])

  const fetchSuggestions = async () => {
    console.log('fetching')
    console.log('day num', workDayNum)
    console.log('type', workTripType)
    console.log('time', startTime.toDate())
    const query = await workTripMultiQuery(user.company.id, [
      {
        field: 'workDayNum',
        condition: '==',
        value: workDayNum,
      },
      {
        field: 'scheduledDrive.start',
        condition: '>=',
        value: startTime.toDate(),
      },
      {
        field: 'goingTo',
        condition: '==',
        value: workTripType,
      },

      // {field: 'workDayNum', condition: '==', value: currentWeekDay},
    ])
    console.log('trips', query.length)
    setTrips(query)
  }

  useEffect(() => {
    console.log('before fetching')
    fetchSuggestions()
  }, [])

  return (
    <View>
      {trips.length > 0 ? (
        <FlatList
          data={trips}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <SuggestedTripsListItem singleItem={item} navigation={navigation} />
          )}
        />
        ):(
          <Text>No rides</Text>
        )
      }
    </View>
  )
}
