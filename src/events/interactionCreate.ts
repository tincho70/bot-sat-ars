import { Interaction } from 'discord.js'
import { BotEvent } from '../types'

const event: BotEvent = {
  name: 'interactionCreate',
  execute: (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName)
      const cooldown = interaction.client.cooldowns.get(
        `${interaction.commandName}-${interaction.user.username}`
      )
      if (!command) return
      if (command.cooldown && cooldown) {
        if (Date.now() < cooldown) {
          const wait = formatWait(Math.abs(Date.now() - cooldown) / 1000)

          interaction.reply(
            `Tiene que esperar ${wait} para volver a usar este comando.`
          )
          setTimeout(() => interaction.deleteReply(), 5000)
          return
        }
        interaction.client.cooldowns.set(
          `${interaction.commandName}-${interaction.user.username}`,
          Date.now() + command.cooldown * 1000
        )
        setTimeout(() => {
          interaction.client.cooldowns.delete(
            `${interaction.commandName}-${interaction.user.username}`
          )
        }, command.cooldown * 1000)
      } else if (command.cooldown && !cooldown) {
        interaction.client.cooldowns.set(
          `${interaction.commandName}-${interaction.user.username}`,
          Date.now() + command.cooldown * 1000
        )
      }
      command.execute(interaction)
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName)
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        )
        return
      }
      try {
        if (!command.autocomplete) return
        command.autocomplete(interaction)
      } catch (error) {
        console.error(error)
      }
    }
  },
}

const formatWait = (wait: number) => {
  let w = Math.floor(wait)
  if (w < 60) return `${w} segundo${w > 1 ? 's' : ''}`
  else if (w < 3600) {
    w = Math.floor(w / 60)
    return `${w} minuto${w > 1 ? 's' : ''}`
  } else {
    w = Math.floor(w / 3600)
    return `${w} hora${w > 1 ? 's' : ''}`
  }
}

export default event
