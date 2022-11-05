import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema'
import { IPlayer, IHackmonState,  IChatMessage } from '../../types/IHackmonState'

export class Player extends Schema implements IPlayer {
  @type('string') name = ''
  @type('number') x = 705
  @type('number') y = 500
  @type('string') anim = 'adam_idle_down'
}



export class ChatMessage extends Schema implements IChatMessage {
  @type('string') author = ''
  @type('number') createdAt = new Date().getTime()
  @type('string') content = ''
}

export class HackmonState extends Schema implements IHackmonState {
  @type({ map: Player })
  players = new MapSchema<Player>()


  @type([ChatMessage])
  chatMessages = new ArraySchema<ChatMessage>()
}
