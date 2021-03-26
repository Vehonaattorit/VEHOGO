import firebase from 'firebase/app'
import {chatMessageConverter} from '../models/chatMessage'
import 'firebase/firestore'
import {add} from 'react-native-reanimated'

const db = firebase.firestore()

export async function addMessage(chatMessage) {
  try {
    // Create a new message document
    let messageRef = db
      .collection('chats')
      .doc(chatMessage.id)
      .collection('chatMessages')

    messageRef.withConverter(chatMessageConverter).add(chatMessage)
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

export async function getMessage(messageId) {
  try {
    // Add a new document in collection "messages"
    let doc = await db
      .collection('messages')
      .doc(messageId)
      .withConverter(chatMessageConverter)
      .get()

    return doc.data()
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
