import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from 'discord.js'
import { SlashCommand } from '../types'
import convert from '../service/Yadio'

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('conv')
    .setDescription('Convertí ARS <> USD <> SAT')
    .addStringOption((option) =>
      option
        .setName('par')
        .setDescription('Seleccioná el par de monedas')
        .setRequired(true)
        .addChoices(
          { name: 'usdsat', value: 'usd-sat' },
          { name: 'satusd', value: 'sat-usd' },
          { name: 'arssat', value: 'ars-sat' },
          { name: 'satars', value: 'sat-ars' }
        )
    )
    .addNumberOption((option) =>
      option
        .setName('monto')
        .setDescription('Monto a convetir')
        .setRequired(true)
        .setMinValue(0.000000001)
    ),
  execute: async (interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true })
      const pares = (interaction.options.get('par')?.value as string).split('-')
      const amount = interaction.options.get('monto')?.value as number
      if (amount < 0) {
        return await interaction.editReply({
          content: '🚨 El monto debe ser positivo',
        })
      }

      const yadio = await convert(amount, pares[0], pares[1])

      if (yadio && !yadio.error) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
          new ButtonBuilder()
            .setCustomId('publicar')
            .setEmoji({ name: `📤` })
            .setStyle(ButtonStyle.Primary)
            .setLabel('Publicar conversión'),
        ])

        await interaction.editReply({
          content: `${amount.toLocaleString('es-AR')} ${
            pares[0]
          } = ${yadio.result.toLocaleString('es-AR')} ${pares[1]}`,
          components: [row],
        })
      } else {
        await interaction.editReply({
          content: 'Hubo un error al intentar convertir el monto...',
        })
        console.error(yadio)
      }
    } catch (error) {
      console.error(error)
      interaction.editReply({ content: 'Algo salió mal...' })
    }
  },
}

export default command
