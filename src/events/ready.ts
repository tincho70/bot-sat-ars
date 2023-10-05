import { Client, Events } from 'discord.js'
import deployCommands from '../deploy-commands'
import botTicker from '../service/ticker'
import cron from 'node-cron'
import { BotEvent } from '../types'

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    botTicker(client)
    cron.schedule('* * * * *', async () => {
      await client.updateTicker()
    })
    deployCommands(client)
    console.log('Discord bot ready!')
  },
}

export default event
