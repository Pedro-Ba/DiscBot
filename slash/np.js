const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require('discord-player');
const player = useMasterPlayer(); //swap to singleton

module.exports = {
    data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("NOW PLAYING KKKKKKKKKKKK mostra a musica tocando atualmente."),
    async execute(client, interaction) {
        const queue = player.queues.create(interaction.guildId);
        const currentSong = queue.currentTrack;
        interaction.editReply(`Tocando ${currentSong.author} - ${currentSong.title}, link: ${currentSong.url}`)
    }
}