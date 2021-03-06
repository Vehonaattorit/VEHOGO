import firebase from 'firebase/app'
import {v4} from 'uuid/v4'
import {ChatRoom, chatRoomConverter} from '../models/chatRoom'
import 'firebase/firestore'
import {workTripMultiQueryStream} from './workTripController'

import React, {useEffect, useState} from 'react'

const db = firebase.firestore()

export const useChatRoomHooks = () => {
  const [chatRooms, setChatRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const chatRoomsListener = db
      .collection('chats')
      .onSnapshot((querySnapshot) => {
        const chatRooms = querySnapshot.docs.map((doc) => {
          return {
            _id: doc.id,
            name: '',
            latestMessage: {
              text: '',
            },
            ...doc.data(),
          }
        })

        setIsLoading(false)
        setChatRooms(chatRooms)
      })
    return () => chatRoomsListener()
  }, [])

  return {
    chatRooms,
    isLoading,
  }
}

export async function addChat(chat) {
  try {
    if (chat.id === undefined) {
      chat.id = v4()
    }

    // Create a new chat document
    let chatRef = db.collection('chats').doc(chat.id)

    chatRef.withConverter(chatRoomConverter).set(chat, {
      merge: true,
    })

    return chat
  } catch (error) {
    console.error('Error writing document: ', error)

    return
  }
}

export async function getChatRoomByIds(querys) {
  try {
    let queryRef = await db.collection('chats').withConverter(chatRoomConverter)

    querys.forEach((query) => {
      queryRef = queryRef.where(query.field, query.condition, query.value)
    })

    let query = await queryRef.get()

    const chatRooms = []
    query.forEach((doc) => {
      chatRooms.push(chatRoomConverter.fromData(doc.data()))
    })

    return chatRooms
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function updateChat(chat) {
  try {
    // Add a new document in collection "chats"
    let chatRef = db.collection('chats').doc(chat.id)

    chatRef.withConverter(chatConverter).set(chat, {merge: true})
  } catch (error) {
    console.error('Error writing document: ', error)
  }
}

export async function getChat(chatId) {
  try {
    // Add a new document in collection "chats"
    let doc = await db
      .collection('chats')
      .doc(chatId)
      .withConverter(chatConverter)
      .get()

    return doc.data()
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}

export const queryChatRoom = async (userID, driverID) => {
  const chatRooms = await getChatRoomByIds([
    {
      field: 'passengerID',
      condition: '==',
      value: userID,
    },
    {
      field: 'driverID',
      condition: '==',
      value: driverID,
    },
  ])

  // Chatrooms array is empty
  let chatRoom
  if (typeof chatRooms !== 'undefined' && chatRooms.length === 0) {
    // if array is empty

    chatRoom = await addChat(
      new ChatRoom({
        driverID: driverID,
        passengerID: userID,
        latestMessage: {
          text: '',
          createdAt: '',
        },
      })
    )
  } else {
    chatRoom = chatRooms[0]
  }

  return chatRoom
}

export function chatStream(chatId) {
  try {
    // Add a new message in collection "chats"
    let doc = db.collection('chats').doc(chatId).withConverter(chatConverter)

    return doc
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}

export async function deleteChatRoom(chatRoomID) {
  try {
    await db.collection('chats').doc(chatRoomID).delete()

    return
  } catch (error) {
    console.error('Error getting document: ', error)
    return
  }
}
