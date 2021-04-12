import React, {useState, useContext, useEffect} from 'react'

import {GiftedChat, Bubble, Send, SystemMessage} from 'react-native-gifted-chat'
import {IconButton} from 'react-native-paper'
import {Button, StyleSheet, View, Text, ActivityIndicator} from 'react-native'

import firebase from '../firebase/fire'

import {sendMessage, getMessages} from '../controllers/chatMessageController'
import {UserContext} from '../contexts'
import {ChatMessage, chatMessageConverter} from '../models/chatMessage'
import {useAuthState} from 'react-firebase-hooks/auth'

import 'firebase/firestore'
import 'firebase/auth'

const auth = firebase.auth()
const firestore = firebase.firestore()

export default ChatRoom = ({navigation, route}) => {
  const [user] = useAuthState(auth)

  const {chatRoomID, chatRoomTitle} = route.params

  // const fetchMessages = async () => {
  //   const prevMessages = await getMessages(chatRoomID)

  //   setMessages(prevMessages)
  // }

  console.log('ChatRoomTitle', chatRoomTitle)

  useEffect(() => {
    navigation.setOptions({
      title: chatRoomTitle,
    })

    const messagesListener = firebase
      .firestore()
      .collection('chats')
      .doc(chatRoomID)
      .collection('chatMessages')
      .withConverter(chatMessageConverter)
      .limit(25)
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const data = doc.data()

          return data
        })

        setMessages(messages)
      })

    return () => messagesListener()
  }, [])

  const [messages, setMessages] = useState([
    /**
     * Mock message data
     *
     */

    // example of system message
    {
      _id: 0,
      text: 'New room created.',
      createdAt: new Date().getTime(),
      system: true,
    },
    {
      _id: 1,
      text: 'Hello !',
      createdAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'User Test',
      },
    },
  ])

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

    const {email, uid} = user

    await sendMessage(
      chatRoomID,
      new ChatMessage({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: uid,
          name: email,
        },
      })
    )
  }

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    )
  }

  const scrollToBottomComponent = () => {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
      </View>
    )
  }

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={36} color="#6646ee" />
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
            backgroundColor: '#6646ee',
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
      messages={messages}
      onSend={handleSend}
      user={{_id: user.uid}}
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
