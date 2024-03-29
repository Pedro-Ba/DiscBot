const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("NOW PLAYING KKKKKKKKKKKK mostra a musica tocando atualmente."),
    async execute(client, interaction) {
        const queue = player.queues.create(interaction.guildId);
        const currentSong = queue.currentTrack;
        if(currentSong){
            await interaction.editReply(`Música atual: \[${currentSong.duration}] ${currentSong.author} - ${currentSong.title}, ${currentSong.url}`);
        }
        else{
            await interaction.editReply(`Seems like nothing is playing.`)
        }
    }
}