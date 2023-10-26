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
        const type = interaction.options.getNumber('mode', true)
        queue.setRepeatMode(type);
        switch (type) {
            case 0:
                await interaction.editReply('The player will not repeat any tracks and will leave when the queue is empty.');
                break;
            case 1:
                await interaction.editReply('The current track will be on repeat until the mode is changed.');
                break;
            case 2:
                await interaction.editReply('The entire queue will be repeated until this mode is deactivated.');
                break;
            case 3:
                await interaction.editReply('When the queue is empty, the player will continue to play random music that is similar to what was previously being played.');
                break;
            default:
                await interaction.editReply('You should never ever fall in here. If this message ever shows up something went seriously wrong.');
                console.log('Should be unreachable. Queue repeat mode: ' + queue.repeatMode);
                break;
        }
    }
}