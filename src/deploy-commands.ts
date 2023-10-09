/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, REST, Routes } from 'discord.js'

const deployCommands = (client: Client) => {
  if (client.commands.size > 0) {
    const commands: string[] = []

    client.commands.forEach((command) => {
      commands.push(command.data.toJSON())
    })

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!)

    // and deploy your commands!
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    )
    ;(async () => {
      try {
        // The put method is used to fully refresh all commands in the guild with the current set
        if (process.env.NODE_ENV == 'production') {
          rest
            .put(Routes.applicationCommands(process.env.DISCORD_APP_ID!), {
              body: commands,
            })
            .then((data: any) => {
              console.log(
                `Successfully reloaded ${data.length} application (/) commands.`
              )
            })
        } else {
          // Si estoy en development, solo hago el deploy en el server de desarrollo
          rest
            .put(
              Routes.applicationGuildCommands(
                process.env.DISCORD_APP_ID!,
                process.env.DISCORD_GUILD_ID!
              ),
              {
                body: commands,
              }
            )
            .then((data: any) => {
              console.log(
                `Successfully reloaded ${data.length} application (/) commands.`
              )
            })
          /*rest
            .put(
              Routes.applicationGuildCommands(
                process.env.DISCORD_APP_ID!,
                process.env.DISCORD_GUILD_ID!
              ),
              {
                body: commands,
              }
            )
            .then((data: any) => {
              console.log(
                `Successfully reloaded ${data.length} application (/) commands.`
              )
            })*/
        }
      } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error)
      }
    })()
  }
}

export default deployCommands
