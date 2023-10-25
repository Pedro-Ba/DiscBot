const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue"),
    async execute(client, interaction) {
        const queue = player.queues.create(interaction.guildId);
        const currentSong = queue.currentTrack;
        const currentString = `Música atual: \[${currentSong.duration}] ${currentSong.author} - ${currentSong.title}`;
        const queueString = queue.tracks.data.slice(0, 10).map((song, i) => {
            return `${i + 1}. \[${song.duration}] ${song.title}`
        }).join("\n")
        interaction.editReply(currentString + '\n' + queueString);
    }
}