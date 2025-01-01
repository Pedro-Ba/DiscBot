const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMainPlayer, useTimeline } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("Now Playing: Mostra a musica atualmente tocando."),
    async execute(client, interaction) {
        const queue = player.queues.create(interaction.guildId);
        const timeline = useTimeline(interaction.guildId);
        const currentSong = queue.currentTrack;
        if(currentSong){
            await interaction.editReply(`Música atual: \[${timeline.timestamp.current.label} | ${currentSong.duration}] ${currentSong.author} - ${currentSong.title}, ${currentSong.url}`);
        }
        else{
            await interaction.editReply(`Seems like nothing is playing.`)
        }
    }
}
