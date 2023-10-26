const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setmode")
    .setDescription("This is used to set the repeat mode of the queue.")
    .addNumberOption((option) => {
        option.setName('mode')
            .setDescription('The repeat mode to be used.')
            .setRequired(true)
            .addChoices(
                { name: 'Track', value: 1},
                { name: 'Queue', value: 2},
                { name: 'Autoplay', value: 3},
                { name: 'None', value: 0}
            )
            return option;
    }),
    async execute(client, interaction) {
        const queue = player.queues.create(interaction.guildId);
        queue.setRepeatMode(interaction.options.getNumber('mode', true));
        console.log(queue.repeatMode);
        await interaction.editReply('ok');
    }
}