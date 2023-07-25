const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require('discord-player');
const player = useMasterPlayer();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue"),
    async execute(client, interaction) {
        console.log(player.queues);
    }
}