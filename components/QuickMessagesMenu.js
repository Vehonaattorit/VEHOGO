import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Picker} from 'native-base'
import {sendMessage} from '../controllers/chatMessageController'
import {ChatMessage} from '../models/chatMessage'
import {useAuthState} from 'react-firebase-hooks/auth'
import 'firebase/auth'

import firebase from 'firebase/app'
import {queryChatRoom} from '../controllers/chatRoomController'
import {getUser} from '../controllers/userController'
import {color} from '../constants/colors'

const auth = firebase.auth()

const passengerMessages = [
  {
    itemName: 'Select an option.',
  },
  {
    itemName: 'Where are you?',
  },
  {
    itemName: "I'll be ready in 5 minutes.",
  },
  {
    itemName: "I'm waiting outside.",
  },
  {
    itemName: 'Where are you?',
  },
]

const driverMessages = [
  {
    itemName: 'Select an option.',
  },
  {
    itemName: "Hey! I'm on my way to pick you up.",
  },
  {
    itemName: "I'll be there in 5 minutes.",
  },
  {
    itemName: "I'm here.",
  },
  {
    itemName: 'Where are you?',
  },
  {
    itemName: 'Where can I pick you up?',
  },
]

const QuickMessagesMenu = ({user, item, workTrip}) => {
  const [chatUser] = useAuthState(auth)

  const [selectedMessage, setSelectedMessage] = useState('')
  const [messages, setCategories] = useState(
    user.travelPreference === 'passenger' ? passengerMessages : driverMessages
  )

  const quickMessageUser = async (value) => {
    const {uid} = chatUser

    const userID = user.travelPreference === 'passenger' ? item.id : item.userID

    const chatRoom = await queryChatRoom(userID, workTrip.driverID)

    await sendMessage(
      chatRoom.id,
      new ChatMessage({
        text: value,
        createdAt: new Date().getTime(),
        user: {
          id: uid,
          name: user.userName,
        },
      })
    )

    const {passengerID, driverID} = chatRoom

    // Get opposite user's ID
    const userId =
      user.travelPreference === 'passenger' ? driverID : passengerID
    const userToken = await getUser(userId)

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userToken.ownerPushToken,
        title: 'Received new message',
        body: `Message sent from ${user.userName}`,
      }),
    })
  }

  const handleChangeOption = (value) => {
    // itemName: 'Select an option.',
    if (value !== 'Select an option.') {
      setSelectedMessage(value)
    }
  }

  const onValueChangeCat = async (value) => {
    handleChangeOption(value)

    await quickMessageUser(value)
  }

  return (
    <View style={styles.viewStyle}>
      <View style={{flex: 0.3}}>
        <Text style={styles.textStyle}>Quick Message</Text>
      </View>
      <View style={{flex: 0.7, fontSize: 14}}>
        <Picker
          itemStyle={styles.itemStyle}
          mode="dropdown"
          style={styles.pickerStyle}
          selectedValue={selectedMessage}
          onValueChange={onValueChangeCat}
        >
          {messages.map((item, index) => (
            <Picker.Item
              key={index}
              color={color.pickerItem}
              label={item.itemName}
              value={item.itemName}
              index={index}
            />
          ))}
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // PICKER STYLE
  viewStyle: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '92%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemStyle: {
    fontSize: 10,
    fontFamily: 'open-sans-semi-bold',
    color: color.darkBlue,
  },
  pickerStyle: {
    width: '100%',
    height: 40,
    color: color.darkBlue,
    fontSize: 14,
    fontFamily: 'open-sans-semi-bold',
  },
  textStyle: {
    fontSize: 14,
    fontFamily: 'open-sans-semi-bold',
  },
})

export default QuickMessagesMenu
