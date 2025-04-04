const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays audio into the voice channel.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName("song")
                .setDescription("Loads a single song from a url")
                .addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("playlist")
                .setDescription("Loads a playlist of songs from a url")
                .addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("search")
                .setDescription("Searches for song based on provided keywords")
                .addStringOption((option) =>
                    option.setName("searchterms").setDescription("the search keywords").setRequired(true)
                )
        ),
    async execute(client, interaction) {
        const queue = player.queues.create(interaction.guildId);
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You are not connected to a voice channel!');
        if (interaction.options.getSubcommand() === "song") {
            const query = interaction.options.getString('url', true);
            try {
                await player.play(channel, query, {
                    nodeOptions: {
                        metadata: interaction
                    }
                });
                interaction.editReply(`Added ${query} to queue`);
            } catch (e) {
                return interaction.followUp(`Something went wrong: ${e}`);
            }
        }
        if (interaction.options.getSubcommand() === "search"){
            let searchTerms = interaction.options.getString("searchterms");
            const result = await player.search(searchTerms, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });
            
            if (result.tracks.length === 0) return interaction.editReply("Encontrei n primo");
            let song = result.tracks[0];
            try {
                await player.play(channel, song, {
                    nodeOptions: {
                        metadata: interaction
                    }
                });
                interaction.editReply(`Added ${song.url} to queue`);
            } catch (e) {
                return interaction.followUp(`Something went wrong: ${e}`);
            }
        }
    }
}
