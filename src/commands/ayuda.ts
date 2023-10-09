import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types'

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ayuda')
    .setDescription('Obtiene ayuda para los comandos del bot'),
  execute: async (interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true })
      const author = {
        name: 'Bot Satoshi - $ARS',
        iconURL: '',
      }

      if (interaction.guild?.members.me?.user.avatarURL()) {
        author.iconURL = interaction.guild?.members.me?.user.avatarURL() ?? ''
      }

      const commands = interaction.client.commands
        .filter((cmd) => cmd.data.name !== 'ayuda')
        .map((cmd) => cmd.data)
      const embed = new EmbedBuilder()
        .setAuthor(author)
        .setTitle('AYUDA')
        .setDescription(
          `Soy un simple bot de Discord que muestra en forma de ticker el precio de 1 Satoshi en pesos Argentinos.\n(*buscame en el lateral derecho del servidor*)\n\nLos **comandos** que podés usar conmigo son:\n\n${commands.map(
            (cmd) => `* \`/${cmd.name}\`: ${cmd.description}`
          )}`
        )
        .setColor('#f99823')

      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.error(error)
      interaction.editReply({ content: 'Algo salió mal...' })
    }
  },
}

export default command
