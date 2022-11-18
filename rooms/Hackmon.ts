import { Room, Client } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Player, HackmonState } from './schema/HackmonState'
import { Message } from '../types/Messages'
import PlayerUpdateCommand from './commands/PlayerUpdateCommand'
import PlayerUpdateNameCommand from './commands/PlayerUpdateNameCommand'
import ChatMessageUpdateCommand from './commands/ChatMessageUpdateCommand'

export class Hackmon extends Room<HackmonState> {
  private dispatcher = new Dispatcher(this)

  onCreate(options: any) {
    console.log('Hackmon is ok!')
    this.setState(new HackmonState())
    this.autoDispose = false

  

    // update player detail
    this.onMessage(
      Message.UPDATE_PLAYER,
      (client, message: { x: number; y: number; anim: string }) => {
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          client,
          x: message.x,
          y: message.y,
          anim: message.anim,
        })
      }
    )

    // when receiving updatePlayerName message, call the PlayerUpdateNameCommand
    this.onMessage(Message.UPDATE_PLAYER_NAME, (client, message: { name: string }) => {
      this.dispatcher.dispatch(new PlayerUpdateNameCommand(), {
        client,
        name: message.name,
      })
    })

    // when a player is ready to connect, call the PlayerReadyToConnectCommand
    this.onMessage(Message.READY_TO_CONNECT, (client) => {
      const player = this.state.players.get(client.sessionId)
      // if (player) player.readyToConnect = true
    })

    

    // send message
    this.onMessage(Message.ADD_CHAT_MESSAGE, (client, message: { content: string }) => {
      
      this.dispatcher.dispatch(new ChatMessageUpdateCommand(), {
        client,
        content: message.content,
      })

      // update message
      this.broadcast(
        Message.ADD_CHAT_MESSAGE,
        { clientId: client.sessionId, content: message.content },
        { except: client }
      )
    })
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player())
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
   
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
  }
}
