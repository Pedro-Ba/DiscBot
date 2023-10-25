const {SlashCommandBuilder} = require("@discordjs/builders")
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports={
    data: new SlashCommandBuilder()
    .setName("resume").setDescription("Starts the song again."),
    async execute(client, interaction){
        const queue = player.queues.create(interaction.guildId);
        queue.node.resume();
        await interaction.editReply("Resumed.")
    }
}