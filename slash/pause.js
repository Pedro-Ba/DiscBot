const {SlashCommandBuilder} = require("@discordjs/builders")
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports={
    data: new SlashCommandBuilder()
    .setName("pause").setDescription("Pauses."),
    async execute(client, interaction){
        const queue = player.queues.create(interaction.guildId);
        queue.node.pause();
        await interaction.editReply("Paused.")
    }
}