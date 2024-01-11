import { ActivityType, Client } from 'discord.js'
import convert from './Yadio'

const botTicker = (client: Client) => {
  client.updateTicker = async () => {
    try {
      const yadio = await convert(1, 'sat', 'ars')
      if (yadio && !yadio.error) {
        const nickname = `$${yadio.result.toLocaleString('es-AR')} ARS`
        client.user!.setPresence({
          activities: [
            {
              type: ActivityType.Custom,
              name: 'custom', // name is exposed through the API but not shown in the client for ActivityType.Custom
              state: `1 ARS ~ ${(1 / yadio.result).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} SAT`,
            },
          ],
          status: 'online',
        })
        client.guilds.cache.forEach((guild) => {
          if (nickname != guild.members.me?.nickname) {
            guild.members.me?.setNickname(nickname).catch(console.error)
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export default botTicker
