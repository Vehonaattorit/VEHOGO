export class ChatMessage {
  constructor({_id, text, createdAt, user}) {
    this._id = _id
    this.text = text
    this.createdAt = createdAt
    this.user = user
  }
}

// Firestore data converter
export const chatMessageConverter = {
  toFirestore: function (chatMessage) {
    let chatRoomObject = {}
    if (chatMessage._id != undefined) {
      chatRoomObject._id = chatMessage._id
    }
    if (chatMessage.text != undefined) {
      chatRoomObject.text = chatMessage.text
    }
    if (chatMessage.createdAt != undefined) {
      chatRoomObject.createdAt = chatMessage.createdAt
    }
    if (chatMessage.user != undefined) {
      chatRoomObject.user = chatMessage.user
      // chatRoomObject.user = userConverter.toFirestore(chatMessage.user)
    }

    return chatRoomObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)

    return new ChatMessage({
      _id: data._id,
      text: data.text,
      createdAt: data.createdAt,
      user: data.user,
    })
  },
  fromData: function (data) {
    return new ChatMessage({
      _id: data._id,
      text: data.text,
      createdAt: data.createdAt,
      user: data.user,
    })
  },
}

// class User {
//   constructor({id, email}) {
//     this.id = id
//     this.email = email
//   }
// }

// // Firestore data converter
// const userConverter = {
//   toFirestore: function (user) {
//     let userObject = {}
//     if (user._id != undefined) {
//       userObject.id = user._id
//     }
//     if (user.email != undefined) {
//       userObject.email = user.email
//     }

//     return userObject
//   },
//   fromFirestore: function (snapshot, options) {
//     const data = snapshot.data(options)

//

//     return new User({
//       id: data.id,
//       createdAt: data.createdAt,
//     })
//   },
// }
