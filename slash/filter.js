const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("toggles audio filters.")
    .addStringOption((option) => {
        option.setName('name')
            .setDescription('the name of the filter to toggle.')
            .setRequired(true)
            return option;
    }),
    async execute(client, interaction) {
        const queue = player.nodes.get(interaction.guildId);
        let filterName = interaction.options.getString('name');
        queue.filters.ffmpeg.toggle(filterName);
        let disabledFilters = queue.filters.ffmpeg.getFiltersDisabled();
        let enabledFilters = queue.filters.ffmpeg.getFiltersEnabled();
        interaction.editReply(`The filter has been toggled. Here is the list of currently disabled filters: ${disabledFilters}, and the list of currently enabled filters: ${enabledFilters}`);
    }
}