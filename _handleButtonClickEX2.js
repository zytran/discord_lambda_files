//This one is for replying to the message

module.exports = async (event) => {
    try {
        if (!event.body) {
            throw new Error("event.body is undefined");
        }

        const body = JSON.parse(event.body);
        const customId = body.data.custom_id;

        if (!customId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid button interaction" }),
            };
        }

        let responseMessage;

        // Handle the button actions
        if (customId === 'confirm_action') {
            responseMessage = "✅ Action confirmed!";
        } else if (customId === 'cancel_action') {
            responseMessage = "❌ Action canceled!";
        } else {
            responseMessage = "Unknown action.";
        }

        // Send a new message instead of editing the original
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4, // New response type to send a message
                data: {
                    content: responseMessage, // New content for the message
                    flags: 64, // Optionally, you can add flags like ephemeral here if needed
                }
            }),
        };

    } catch (error) {
        console.error("Error handling button interaction:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", message: error.message }),
        };
    }
};
