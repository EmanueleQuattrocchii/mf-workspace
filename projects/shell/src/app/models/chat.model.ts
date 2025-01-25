export interface Message {
  id: string,
  body: string,
  senderId: string,
  senderName: string,
  timeStamp: Date
}
export interface Chat {
  id: string,
  participants: Array<string>,
  sessionId: string,
  messages: Array<Message>
}