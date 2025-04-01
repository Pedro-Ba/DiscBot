const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMainPlayer } = require('discord-player');
const { Embed, EmbedBuilder } = require("discord.js");
const pagination = require("../functions/pagination");
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue"),
    async execute(client, interaction) {
        let embeds = [];
        const queue = player.queues.create(interaction.guildId);
        const currentSong = queue.currentTrack;
        const currentString = `Música atual: \[${currentSong.duration}] ${currentSong.author} - ${currentSong.title}`;
        embeds.push(await createEmbed(queue.tracks.data, queue.size));
        // const queueString = queue.tracks.data.slice(0, 10).map((song, i) => {
        //     return `${i + 1}. \[${song.duration}] ${song.title}`
        // }).join("\n")
        // interaction.editReply(currentString + '\n' + queueString);
        await pagination(interaction, embeds);
    }
}

async function createEmbed(queueData, queueSize){
    let stringInput = '';
    for(let i = 0; i < queueSize; i++){
        //track has title, athor, url, thumbnail, duration, description.
        //create string input where each input is a line. We need the index we're currently in, so this might not be the best.
        stringInput = stringInput + '[' + queueData[i].author + ' - ' + queueData[i].title + '](' + queueData[i].url +')\n';
    }
    return new EmbedBuilder().setTitle('Queue: ').setDescription(stringInput);
}
