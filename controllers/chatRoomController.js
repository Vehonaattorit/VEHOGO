import firebase from 'firebase/app'
import {chatConverter} from '../models/chatRoom'
import 'firebase/firestore'

const db = firebase.firestore()

export async function addChat(newChat) {
  try {
    // Create a new chat document
    let chatRef = db.collection('chats')

    console.log('new Chat', newChat)
    chatRef.withConverter(chatConverter).add(newChat)
  } catch (error) {
    console.error('Error writing document: ', error)

    return
  }
  // try {
  //   db.collection('chats').add({
  //     name: roomName,
  //     latestMessage: {
  //       text: `You have joined the room ${roomName}.`,
  //       createdAt: new Date().getTime(),
  //     },
  //   })
  // } catch (err) {}
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
    console.log('chatId', chatId)
    // Add a new document in collection "chats"
    let doc = await db
      .collection('chats')
      .doc(chatId)
      .withConverter(chatConverter)
      .get()

    console.log('doc.data()', doc.data())

    return doc.data()
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
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
