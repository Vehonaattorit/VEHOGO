import firebase from 'firebase/app'
import {v4} from 'uuid/v4'
import {chatMessageConverter} from '../models/chatMessage'
import 'firebase/firestore'
import {chatRoomConverter} from '../models/chatRoom'
import React, {useEffect, useContext, useState} from 'react'
import {UserContext} from '../contexts'

const db = firebase.firestore()

export const useMessageHooks = (chatRoom) => {
  const {user} = useContext(UserContext)

  const [messages, setMessages] = useState([])

  useEffect(() => {
    const messagesListener = db
      .collection('chats')
      .doc(chatRoom.id)
      .collection('chatMessages')
      .withConverter(chatMessageConverter)
      .limit(25)
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        let messages = []

        querySnapshot.docs.forEach((doc, i, arr) => {
          let data = doc.data()

          messages.push(data)
        })

        let popMessage = messages[0]

        if (popMessage === undefined) return

        if (popMessage.user._id !== user.id) {
          popMessage = {
            ...popMessage,
            quickReplies: {
              type: 'radio', // or 'checkbox',
              keepIt: true,
              values: [
                {
                  title: 'Sound good.',
                },
                {
                  title: 'No, sorry.',
                },
                {
                  title: 'What else?',
                },
              ],
            },
          }

          messages.shift()

          messages.unshift(popMessage)
        }

        setMessages(messages)
      })
    return () => messagesListener()
  }, [])

  return {
    messages,
  }
}

export async function sendMessage(chatRoomID, chatMessage) {
  try {
    if (chatMessage._id === undefined) {
      chatMessage._id = v4()
    }

    // Create a new chat document
    let chatMessageRef = db
      .collection('chats')
      .doc(chatRoomID)
      .collection('chatMessages')
      .doc(chatMessage._id)

    chatMessageRef.withConverter(chatMessageConverter).set(chatMessage, {
      merge: true,
    })

    let chatRoomRef = db.collection('chats').doc(chatRoomID)

    chatRoomRef.withConverter(chatRoomConverter).set(
      {
        latestMessage: {
          text: chatMessage.text,
          createdAt: chatMessage.createdAt,
        },
      },
      {merge: true}
    )

    return chatMessage.id
  } catch (error) {
    console.error('Error writing document: ', error)

    return
  }
}

export async function updateMessage(message) {
  try {
    // Add a new document in collection "messages"
    let messageRef = db.collection('messages').doc(message.id)

    messageRef.withConverter(chatMessageConverter).set(message, {merge: true})
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getMessages(chatRoomID) {
  try {
    // Get all ChatRoom messages
    let messagesRef = await db
      .collection('chats')
      .doc(chatRoomID)
      .collection('chatMessages')
      .withConverter(chatMessageConverter)
      .limit(25)
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const newMessages = []

        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data()

          return firebaseData
        })

        return messages
      })
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}

export function messageStream(messageId) {
  try {
    // Add a new message in collection "messages"
    let doc = db
      .collection('messages')
      .doc(messageId)
      .withConverter(chatMessageConverter)

    return doc
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}
