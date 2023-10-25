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
            .setAutocomplete(true)
            return option;
    }),
    async autocomplete(client, interaction){
        const focusedValue = interaction.options.getFocused();
        const queue = player.queues.create(interaction.guildId);
        let disabledFilters = queue.filters.ffmpeg.getFiltersDisabled();
        let enabledFilters = queue.filters.ffmpeg.getFiltersEnabled();
        let filters = disabledFilters+ ',' + enabledFilters;
        filters = filters.split(',');
        console.log(filters); //not sure if this works actually
        const filtered = filters.filter(choice => choice.includes(focusedValue)).slice(0,25);
        if(filtered.length > 25){
            console.log('Too many options for autocomplete');
        }
        else{
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice}))
            )
        }
    },
    async execute(client, interaction) {
        const queue = player.nodes.get(interaction.guildId);
        let filterName = interaction.options.getString('name');
        queue.filters.ffmpeg.toggle(filterName);
        let disabledFilters = queue.filters.ffmpeg.getFiltersDisabled();
        let enabledFilters = queue.filters.ffmpeg.getFiltersEnabled();
        interaction.editReply(`The filter ${filterName} has been toggled.`);
    }
}