export class ChatRoom {
  constructor({id, driverID, passengerID, latestMessage}) {
    this.id = id
    this.driverID = driverID
    this.passengerID = passengerID
    this.latestMessage = latestMessage
  }
}

// Firestore data converter
export const chatRoomConverter = {
  toFirestore: function (chatRoom) {
    let chatRoomObject = {}
    if (chatRoom.id != undefined) {
      chatRoomObject.id = chatRoom.id
    }
    if (chatRoom.driverID != undefined) {
      chatRoomObject.driverID = chatRoom.driverID
    }
    if (chatRoom.passengerID != undefined) {
      chatRoomObject.passengerID = chatRoom.passengerID
    }
    if (chatRoom.latestMessage != undefined) {
      chatRoomObject.latestMessage = latestMessageConverter.toFirestore(
        chatRoom.latestMessage
      )
    }

    return chatRoomObject
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options)

    return new ChatRoom({
      id: data.id,
      driverID: data.driverID,
      passengerID: data.passengerID,
      // latestMessage: latestMessageConverter.fromFirestore(data.latestMessage),
    })
  },
  fromData: function (data) {
    return new ChatRoom({
      id: data.id,
      driverID: data.driverID,
      passengerID: data.passengerID,
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
    let LatestMessageObject = {}
    if (latestMessage.text != undefined) {
      LatestMessageObject.text = latestMessage.text
    }
    if (latestMessage.createdAt != undefined) {
      LatestMessageObject.createdAt = latestMessage.createdAt
    }

    return LatestMessageObject
  },
  fromFirestore: function (data) {
    // const data = snapshot.data(options)

    return new LatestMessage({
      createdAt: data.createdAt,
      text: data.text,
    })
  },
}
