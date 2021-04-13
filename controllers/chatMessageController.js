import firebase from 'firebase/app'
import {v4} from 'uuid/v4'
import {chatMessageConverter} from '../models/chatMessage'
import 'firebase/firestore'

const db = firebase.firestore()

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

    return chatMessage.id
  } catch (error) {
    console.error('Error writing document: ', error)

    return
  }
  // try {
  //   if (chatMessage.id === undefined) {
  //     chatMessage.id = v4()
  //   }

  //   // Create a new message document
  //   let messageRef = db
  //     .collection('chats')
  //     .doc(chatRoomID)
  //     .collection('chatMessages')

  //

  //   messageRef
  //     .withConverter(chatMessageConverter)
  //     .set(chatMessage, {merge: true})

  //   return chatMessage.id
  // } catch (error) {
  //   console.error('Error writing document: ', error)

  //   return
  // }
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

    // let query = await messagesRef.orderBy('createdAt', 'desc').limit(25).get()

    // const messages = []

    // query.forEach((doc) => {
    //   messages.push(chatMessageConverter.fromData(doc.data()))
    // })

    // return messages
  } catch (error) {
    console.error('Error writing document: ', error)
    return
  }
}

// export async function getMessage(messageId) {
//   try {
//     // Add a new document in collection "messages"
//     let doc = await db
//       .collection('messages')
//       .doc(messageId)
//       .withConverter(chatMessageConverter)
//       .get()

//     return doc.data()
//   } catch (error) {
//     console.error('Error writing document: ', error)
//     return
//   }
// }

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
