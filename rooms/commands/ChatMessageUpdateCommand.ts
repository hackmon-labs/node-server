import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IHackmonState } from '../../types/IHackmonState'
import { ChatMessage } from '../schema/HackmonState'

type Payload = {
  client: Client
  content: string
}

export default class ChatMessageUpdateCommand extends Command<IHackmonState, Payload> {
  execute(data: Payload) {
    const { client, content } = data
    const player = this.room.state.players.get(client.sessionId)
    const chatMessages = this.room.state.chatMessages

    if (!chatMessages) return

    
    if (chatMessages.length >= 50) chatMessages.shift()

    const newMessage = new ChatMessage()
    newMessage.author = player.name
    newMessage.content = content
    chatMessages.push(newMessage)
  }
}
