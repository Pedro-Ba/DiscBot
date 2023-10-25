const {SlashCommandBuilder} = require("@discordjs/builders")
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports={
    data: new SlashCommandBuilder()
    .setName("skip").setDescription("Skips the current song."),
    async execute(client, interaction){
        const queue = player.queues.create(interaction.guildId);
        queue.node.skip();
        await interaction.editReply("Paused.")
    }
}