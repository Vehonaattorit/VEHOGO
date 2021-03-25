export class ChatMessage {
  constructor({id, text, createdAt, user}) {
    this.id = id
    this.text = text
    this.createdAt = createdAt
    this.user = user
  }
}

// Firestore data converter
export const chatMessageConverter = {
  toFirestore: function (chatMessage) {
    console.log('toFirestore chatMessage', chatMessage)

    let chatRoomObject = {}
    if (chatMessage.id != undefined) {
      chatRoomObject.id = chatMessage.id
    }
    if (chatMessage.text != undefined) {
      chatRoomObject.text = chatMessage.text
    }
    if (chatMessage.createdAt != undefined) {
      chatRoomObject.createdAt = chatMessage.createdAt
    }
    if (chatMessage.user != undefined) {
      chatRoomObject.user = userConverter.toFirestore(chatMessage.user)
    }

    console.log('chatRoomObject chatRoomObject', chatRoomObject)

    return chatRoomObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new ChatMessage({
      id: data._id,
      text: data.text,
      createdAt: data.createdAt,
      user: userConverter.fromFirestore(data.user),
    })
  },
}

class User {
  constructor({id, email}) {
    this.id = id
    this.email = email
  }
}

// Firestore data converter
const userConverter = {
  toFirestore: function (user) {
    console.log('userConverter toFirestore user', user)

    let userObject = {}
    if (user._id != undefined) {
      userObject.id = user._id
    }
    if (user.email != undefined) {
      userObject.email = user.email
    }

    console.log('userObject', userObject)

    return userObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)
    return new User({
      id: data._id,
      createdAt: data.createdAt,
    })
  },
}
