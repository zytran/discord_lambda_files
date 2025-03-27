//This one is for editing the original message

module.exports = async (body) => {
    try {
        
        const customId = body.data.custom_id;
        const messageId = body.message.id; // Original message ID
        const userID = body.member.user.id;
  
        if (!customId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid button interaction" }),
            };
        }
  
        let responseMessage;
  
        // Handle the button actions
        if (customId === 'default_pokeball') {
            responseMessage = `#  <@${userID}> Caught the Pokemon!`;
        } else if (customId === 'great_ball') {
            responseMessage = `${messageId} # Pokemon ran Away!`;
        
        }
        else if(customId === "ultra_ball"){
            responseMessage ===" ultra ball";
        }
        else if (customId==="master_ball"){
            responseMessage === "master ball"
        }
        else {
            responseMessage = "Unknown action.";
        }
  
        // Create disabled buttons
        const updatedButtons = {
            type: 1, // ActionRow
            components: body.message.components[0].components.map(button => ({
                ...button,
                disabled: true // Disable the button
            }))
        };
  
        // Send the response and disable the buttons
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 7, // Edit the original message
                data: {
                    content: responseMessage, // New content for the message
                    components: [updatedButtons] // Disable buttons
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
  