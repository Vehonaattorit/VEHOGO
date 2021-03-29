export class ChatRoom {
  constructor({driverId, passengerId, latestMessage}) {
    this.driverId = driverId
    this.passengerId = passengerId
    this.latestMessage = latestMessage
  }
}

// Firestore data converter
export const chatConverter = {
  toFirestore: function (chatRoom) {
    console.log('chatRoom', chatRoom)
    let chatRoomObject = {}
    if (chatRoom.driverId != undefined) {
      chatRoomObject.driverId = chatRoom.driverId
    }
    if (chatRoom.passengerId != undefined) {
      chatRoomObject.passengerId = chatRoom.passengerId
    }
    if (chatRoom.latestMessage != undefined) {
      console.log('chatRoom.latestMessage', chatRoom.latestMessage)
      chatRoomObject.latestMessage = latestMessageConverter.toFirestore(
        chatRoom.latestMessage
      )
    }

    console.log('chatRoomObject', chatRoomObject)

    return chatRoomObject
  },
  fromFirestore: function (snapshot, options) {
    console.log('chatRoom snapshot ', snapshot.data())
    console.log('chatRoom  options', options)
    const data = snapshot.data(options)

    console.log('data jotain', data)
    return new ChatRoom({
      driverId: data.driverId,
      passengerId: data.passengerId,
      latestMessage: latestMessageConverter.fromFirestore(data.latestMessage),
    })
  },
}

class LatestMessage {
  constructor({text, createdAt}) {
    this.text = text
    this.createdAt = createdAt
  }
}

// Firestore data converter
const latestMessageConverter = {
  toFirestore: function (latestMessage) {
    console.log('latestMessageConverter latestMessage', latestMessage)
    let LatestMessageObject = {}
    if (latestMessage.text != undefined) {
      LatestMessageObject.text = latestMessage.text
    }
    if (latestMessage.createdAt != undefined) {
      LatestMessageObject.createdAt = latestMessage.createdAt
    }

    console.log('LatestMessageObject LatestMessageObject', LatestMessageObject)

    return LatestMessageObject
  },
  fromFirestore: function (data) {
    console.log('fromFirestore jotain')
    // const data = snapshot.data(options)

    console.log('fromFirestore', data)

    console.log('fromFirestore data jotain', data)

    return new LatestMessage({
      createdAt: data.createdAt,
      text: data.text,
    })
  },
}
