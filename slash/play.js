const { SlashCommandBuilder } = require('discord.js');

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
                .setDescription("Searches for sogn based on provided keywords")
                .addStringOption((option) =>
                    option.setName("searchterms").setDescription("the search keywords").setRequired(true)
                )
        ),
    async execute(client, interaction) {
        const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!');
            if (interaction.options.getSubcommand() === "song") {
            const query = interaction.options.getString('url', true);

            try {
                await client.player.play(channel, query, {
                    nodeOptions: {
                        metadata: interaction
                    }
                });
                interaction.editReply(`Added ${query} to queue`);
                console.log(client.player);
            } catch (e) {
                return interaction.followUp(`Something went wrong: ${e}`);
            }
        }
    }
}