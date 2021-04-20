import React, {useState, useContext, useEffect} from 'react'

import {GiftedChat, Bubble, Send, SystemMessage} from 'react-native-gifted-chat'
import {IconButton} from 'react-native-paper'
import {Button, StyleSheet, View, Text, ActivityIndicator} from 'react-native'

import firebase from '../firebase/fire'

import {
  sendMessage,
  useMessageHooks,
} from '../controllers/chatMessageController'
import {UserContext} from '../contexts'
import {getUser} from '../controllers/userController'
import {ChatMessage} from '../models/chatMessage'
import {useAuthState} from 'react-firebase-hooks/auth'

import 'firebase/firestore'
import 'firebase/auth'

const auth = firebase.auth()

import {color} from '../constants/colors'

export default ChatRoom = ({navigation, route}) => {
  const {user, chatRoom, chatRoomTitle} = route.params

  const [ownerPushToken, setOwnerPushToken] = useState(null)
  const {messages} = useMessageHooks(chatRoom, user)

  const onQuickReply = async (quickReply) => {
    await handleSend([
      {
        text: quickReply[0].title,
      },
    ])
  }

  // AuthState for GiftedChat
  const [chatUser] = useAuthState(auth)

  const getOwnerPushToken = async () => {
    const {passengerID, driverID} = chatRoom

    // Get opposite user's ID
    let currentUser =
      user.travelPreference === 'passenger' ? driverID : passengerID
    currentUser = await getUser(currentUser)

    setOwnerPushToken(currentUser.ownerPushToken)
  }

  useEffect(() => {
    getOwnerPushToken()

    navigation.setOptions({
      title: chatRoomTitle,
    })
  }, [])

  const renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    )
  }

  const handleSend = async (messages) => {
    const text = messages[0].text

    const {uid} = chatUser

    await sendMessage(
      chatRoom.id,
      new ChatMessage({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: uid,
          name: user.userName,
        },
      })
    )

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: ownerPushToken,
        title: 'Received new message',
        body: `Message sent from ${user.userName}`,
      }),
    })
  }

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.darkBlue} />
      </View>
    )
  }

  const scrollToBottomComponent = () => {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton
          icon="chevron-double-down"
          size={26}
          color="#fff"
          style={{
            backgroundColor: color.darkBlue,
          }}
        />
      </View>
    )
  }

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={36} color={color.darkBlue} />
        </View>
      </Send>
    )
  }

  const renderBubble = (props) => {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: color.darkBlue,
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    )
  }

  return (
    <GiftedChat
      // renderQuickReplies={quickReplies}
      // renderQuickReplies={quickReplies}
      onQuickReply={(quickReply) => onQuickReply(quickReply)}
      messages={messages}
      onSend={handleSend}
      user={{_id: chatUser.uid}}
      renderBubble={renderBubble}
      placeholder="Type your message here..."
      showUserAvatar
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      renderLoading={renderLoading}
      renderSystemMessage={renderSystemMessage}
    />
  )
}

// Add corresponding styles
const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
})
