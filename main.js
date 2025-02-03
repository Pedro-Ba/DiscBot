const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")
const { FFmpeg } = require("discord-player/dist")
const { YoutubeiExtractor } = require("discord-player-youtubei")

process.on("uncaughtException", (exception) => {
    //i know, it's stupid. but it stops crashes
    console.log(exception.name)
    console.log(exception.stack)
    console.log(exception.message)
})

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const LOAD_SLASH = process.argv[2] == "load"

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates
    ]
})

const player = Player.singleton(client, {
    Options: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

player.extractors.loadDefault();
player.extractors.register(YoutubeiExtractor, {});


client.slashcommands = new Discord.Collection();

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

//not sure if I like LOAD_SLASH, I might turn this into a separate file to be ran individually later
if (LOAD_SLASH) {
    const rest = new REST({ version: "10" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationCommands(CLIENT_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return
            const slashcmd = client.slashcommands.get(interaction.commandName);
            if (!slashcmd) interaction.reply("Not a valid slash command");
            await interaction.deferReply();
            await slashcmd.execute(client, interaction);
        }
        if (interaction.isAutocomplete()){
            const command = client.slashcommands.get(interaction.commandName);
            try{
                command.autocomplete(client, interaction);
            }
            catch(err){
                console.log(err);
            }
        }
        handleCommand()
    })
    client.login(TOKEN)
}
