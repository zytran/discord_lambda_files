const { EmbedBuilder } = require('discord.js');

module.exports = async(body)=>{
    const exampleEmbed = new EmbedBuilder()
    .setColor(0xFFC5D3)
    .setTitle('Commands Test')
    .setURL('https://Yoshingo.org/')
    .setAuthor({ name: 'Yoshingo', iconURL: 'https://i.imgur.com/IlcxbcC.jpeg', url: 'https://discord.js.org' })
    .setDescription('fortnite balls')
    .setThumbnail('https://i.imgur.com/PeDQKLE.jpeg')
    .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        {name: 'test field here', value:"idk whats valueable", inline: true},
    )
    //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    .setImage('https://i.imgur.com/IlcxbcC.jpeg')
    .setTimestamp()
    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

// Convert EmbedBuilder object to JSON format
const embedJson = exampleEmbed.toJSON();

return {
    statusCode: 200,
    body: JSON.stringify({
        type: 4,
        data: {
            embeds: [embedJson],
        },
    }),
};
}

