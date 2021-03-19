import React, {createContext, useState, useContext} from 'react'

import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'
import {createStackNavigator} from '@react-navigation/stack'
import moment from 'moment-timezone'

import {GraphManager} from './graph/GraphManager'

import {UserContext} from '../contexts/UserContext'
import {TextInput} from 'react-native-gesture-handler'

const Stack = createStackNavigator()

// const NewEventState = createContext({
//   isCreating: false,
//   subject: '',
//   attendees: '',
//   body: '',
//   timeZone: '',
//   startDate: new Date(),
//   endDate: new Date(),
//   disableCreate: () => {
//     return true
//   },
//   updateValue: (val) => {
//     onStateVal
//   },
// })

// The picker acts very differently on Android and iOS
// iOS can use a single picker for both date and time,
// where Android requires two. Also the iOS version can
// be displayed all the time, while the Android version is a
// modal pop-up. Encapsulating this into a reusable component
const DateTimeInput = (props) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const [showTimePicker, setShowTimePicker] = React.useState(
    Platform.OS === 'ios'
  )

  return (
    <View style={Platform.OS === 'android' ? styles.dateTime : null}>
      {Platform.OS === 'android' && (
        <Text
          style={styles.time}
          onPress={() => {
            setShowTimePicker(true)
          }}
        >
          {formatTime(props.value)}
        </Text>
      )}
      {showTimePicker && (
        <DateTimePicker
          mode={Platform.OS === 'ios' ? 'datetime' : 'time'}
          value={props.value}
          onChange={(e, d) => {
            setShowTimePicker(Platform.OS === 'ios')
            if (d) props.onChange(e, d)
          }}
        />
      )}
      {Platform.OS === 'android' && (
        <Text
          style={styles.date}
          onPress={() => {
            setShowDatePicker(true)
          }}
        >
          {formatDate(props.value)}
        </Text>
      )}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          mode="date"
          value={props.value}
          onChange={(e, d) => {
            setShowDatePicker(Platform.OS === 'ios')
            if (d) props.onChange(e, d)
          }}
        />
      )}
    </View>
  )
}

const NewEventComponent = () => {
  const [newEventState, setNewEventState] = useState({
    isCreating: false,
    subject: '',
    attendees: '',
    body: '',
    timeZone: 'UTC',
    startDate: new Date(),
    endDate: new Date(),
  })

  const disableCreate = () => {
    return (
      newEventState.isCreating ||
      newEventState.subject.length <= 0 ||
      moment(newEventState.start).isAfter(newEventState.endDate)
    )
  }

  const updateValue = (newValue, fieldName) => {
    setNewEventState({
      ...newEventState,
      [fieldName]: newValue,
    })

    console.log(fieldName, newValue)
  }

  // const NewEventState = createContext({
  //   isCreating: false,
  //   subject: '',
  //   attendees: '',
  //   body: '',
  //   timeZone: '',
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   disableCreate: () => {
  //     return true
  //   },
  //   updateValue: (val) => {
  //     onStateVal
  //   },
  // })

  const createEvent = async () => {
    // Create a new Event object with the
    // required fields
    const newEvent = {
      subject: newEventState.subject,
      start: {
        dateTime: moment(newEventState.startDate).format('YYYY-MM-DDTHH:mm:ss'),
        timeZone: newEventState.timeZone,
      },
      end: {
        dateTime: moment(newEventState.endDate).format('YYYY-MM-DDTHH:mm:ss'),
        timeZone: newEventState.timeZone,
      },
    }

    // Only add attendees if the user specified them
    if (newEventState.attendees.length > 0) {
      newEvent.attendees = []

      // Value should be a ;-delimited list of email addresses
      // NOTE: The app does no validation of this
      const emails = newEventState.attendees.split(';')

      emails.forEach((email) => {
        newEvent.attendees.push({
          emailAddress: {address: email},
        })
      })
    }

    // Only add body if the user specified one
    if (newEventState.body.length > 0) {
      newEvent.body = {
        content: newEventState.body,
        // For simplicity, add it as a plain-text body
        contentType: 'text',
      }
    }

    console.log('NEW EVENT', {...newEvent})

    try {
      const response = await GraphManager.createEvent(newEvent)

      console.log('NewEventComponent response', response)
    } catch (err) {
      console.log(err)
      Alert.alert(
        'Error creating an event',
        JSON.stringify(err),
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false}
      )
    }

    Alert.alert('Success', 'Event created', [
      {
        text: 'OK',
        onPress: () => {
          updateValue(false, 'isCreating')
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <Modal visible={newEventState.isCreating}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={newEventState.isCreating}
            size="large"
          />
        </View>
      </Modal>
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Subject</Text>
        <TextInput
          style={styles.textInput}
          value={newEventState.subject}
          onChangeText={(text) => updateValue(text, 'subject')}
        />
      </View>
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Attendees</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email (separate multiple with ';')"
          value={newEventState.attendees}
          onChangeText={(text) => updateValue(text, 'attendees')}
        />
      </View>
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Start</Text>
        <DateTimeInput
          value={newEventState.startDate}
          onChange={(e, date) => updateValue(date, 'startDate')}
        />
      </View>
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>End</Text>
        <DateTimeInput
          value={newEventState.endDate}
          onChange={(e, date) => updateValue(date, 'endDate')}
        />
      </View>
      <View style={styles.formField}>
        <TextInput
          style={styles.multiLineTextInput}
          multiline={true}
          textAlignVertical="top"
          placeholder="Body"
          value={newEventState.body}
          onChangeText={(text) => updateValue(text, 'body')}
        />
      </View>
      <View style={styles.formField}>
        <Button
          title="Create"
          disabled={disableCreate()}
          onPress={createEvent}
        />
      </View>
    </ScrollView>
  )
}

const formatTime = (dateTime) => {
  return moment(dateTime).format('h:mm A')
}

const formatDate = (dateTime) => {
  return moment(dateTime).format('MMM D, YYYY')
}

// When first loading the form, set the start time
// to the nearest hour or half-hour
const getDefaultStart = () => {
  const now = moment().startOf('minute')
  const offset = 30 - (now.minute() % 30)

  return now.add(offset, 'minutes').toDate()
}

// When first loading the form, set the end time
// to start + 30 min
const getDefaultEnd = () => {
  return moment(getDefaultStart()).add(30, 'minutes').toDate()
}

// const NewEventScreen = () => {
//   const userContext = useContext(UserContext)

//   console.log('userContext', userContext)

//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="NewEvent"
//         component={NewEventComponent}
//         options={{
//           headerShown: false,
//         }}
//       />
//     </Stack.Navigator>
//     // <View>
//     //   <Text>NewEventScreen</Text>
//     // </View>
//   )
// }

export default NewEventComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formField: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  fieldLabel: {
    fontWeight: '700',
    marginBottom: 10,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    padding: 10,
  },
  multiLineTextInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 200,
    padding: 10,
  },
  time: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    color: '#147efb',
    marginRight: 10,
  },
  date: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    color: '#147efb',
  },
  dateTime: {
    flexDirection: 'row',
  },
})
