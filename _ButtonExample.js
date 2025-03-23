const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (event) => {
    try {
        // Ensure event.body exists before parsing
        const body = event.body ? JSON.parse(event.body) : {};

        // Create an embed
        const exampleEmbed = new EmbedBuilder()
            .setColor(0xFFC5D3)
            .setTitle('Commands Test')
            .setDescription('Click a button to respond!')
            .setTimestamp();

        // Create buttons
        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm_action')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel_action')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        // Action row with buttons
        const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    embeds: [exampleEmbed.toJSON()],
                    components: [row.toJSON()],
                },
            }),
        };

    } catch (error) {
        console.error("Error processing Lambda function:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", message: error.message }),
        };
    }
};
