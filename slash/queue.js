const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue"),
    async execute(client, interaction) {
        const queue = player.queues.create(interaction.guildId);
        for(track in queue.tracks){
            console.log(track);
        }
    }
}