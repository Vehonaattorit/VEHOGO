import React, {useEffect, useState, useContext} from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'
import {SuggestedTripsListItem} from '../components/SuggestedTripsListItem'
import {workTripMultiQuery} from '../controllers/workTripController'
import {UserContext} from '../contexts'
import {color} from '../constants/colors'


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
          <View style={styles.noRides}>
            <Text style={{fontSize: 16, fontFamily: 'open-sans-regular', alignSelf: 'center',}} >No rides found. Try different time.</Text>
          </View>

        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  noRides: {
    backgroundColor: color.lightBlue,
    padding: 10,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 6,
    marginTop: 10
  }
})
