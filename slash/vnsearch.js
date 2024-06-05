const { SlashCommandBuilder } = require("@discordjs/builders");
const { Embed, EmbedBuilder } = require("discord.js");
const pagination = require("../functions/pagination");

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data
    });
    return response.json();
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vnsearch")
        .setDescription("Searches for a VN within VNDB.")
        .addStringOption((option) => option.setName("search").setDescription("The string to be searched").setRequired(true)),
    async execute(client, interaction) {
        const query = interaction.options.getString('search', true);
        let objectInput = {
            "filters": ["search", "=", query],
            "fields": "title",
            "page": 0, //if it starts at 0 that means that I can use the objectInput.page++ better in the while.
        }
        try {
            //solution = make data['more'] start with prebuilt true value so While can go at least once.
            let embeds = [];
            let data = {};
            data['more'] = true;
            while (data['more']) {
                objectInput.page++;
                let jsonString = JSON.stringify(objectInput);
                data = await postData("https://api.vndb.org/kana/vn", jsonString);
                embeds.push(await embedCreator(data));
                //create embed array right here; pass data into a function that creates an embed, and then append it to the embed array function, probably easiest way.
            }
            await pagination(interaction, embeds);
        } catch (e) {
            console.log(e);
            return interaction.followUp("Something went wrong.");
        }
    }
}

async function embedCreator(data) {
    let stringInput = '';
    for (result of data['results']) {
        stringInput = stringInput + '`' + result['title'] + '`\n'
    }
    if(stringInput == '') stringInput = 'No matches were found.';
    return new EmbedBuilder().setColor("Blue").setTitle('Visual Novels: ').setDescription(stringInput);
}