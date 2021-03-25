import React, {useState, useEffect, useContext} from 'react'

import {GiftedChat, Bubble, Send, SystemMessage} from 'react-native-gifted-chat'
import {IconButton} from 'react-native-paper'
import {Button, StyleSheet, View, Text, ActivityIndicator} from 'react-native'

import firebase from '../firebase/fire'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

import 'firebase/firestore'
import 'firebase/auth'

const auth = firebase.auth()
const firestore = firebase.firestore()

export default ChatRoom = ({route}) => {
  const [user] = useAuthState(auth)

  const messagesRef = firestore.collection('messages')

  useEffect(() => {
    const query = messagesRef
      .orderBy('createdAt', 'desc')
      .limit(25)
      .onSnapshot((querySnapshot) => {
        console.log('query', querySnapshot)

        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data()

          console.log('doc', doc)
          console.log('fireabseData', firebaseData)

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          }

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.name,
            }
          }

          console.log('data', data)

          return data
        })

        setMessages(messages)
      })

    return () => query()
  }, [])

  // const [messages] = useCollectionData(query, {idField: '_id'})

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

  // console.log('messages', messages)

  const renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    )
  }

  console.log('auth', user)

  const handleSend = async (messages) => {
    const text = messages[0].text

    const {uid} = user

    await messagesRef.add({
      text,
      createdAt: new Date().getTime(),
      user: {
        _id: uid,
        name: user.email,
      },
    })
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
