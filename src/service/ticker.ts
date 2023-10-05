import { ActivityType, Client } from 'discord.js'
import convert from './Yadio'

const botTicker = (client: Client) => {
  client.updateTicker = async () => {
    try {
      const yadio = await convert(1, 'ARS', 'BTC')
      if (yadio && !yadio.error) {
        const ars = yadio.result * 100000000
        const nickname = `$${(1 / ars).toLocaleString('es-AR')} ARS`
        client.user!.setPresence({
          activities: [
            {
              type: ActivityType.Custom,
              name: 'custom', // name is exposed through the API but not shown in the client for ActivityType.Custom
              state: `${ars} SAT = $1 ARS`,
            },
          ],
          status: 'online',
        })
        client.guilds.cache.forEach((guild) => {
          nickname != guild.members.me?.nickname ??
            guild.members.me?.setNickname(nickname).catch(console.error)
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export default botTicker
