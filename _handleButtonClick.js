const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const bucketName = "useramounts";
const filename = "currentPokemon.json";

module.exports = async (body) => {
    try {
        const customId = body.data.custom_id;
        const messageId = body.message.id;
        const userID = body.member.user.id;

        if (!customId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid button interaction" }),
            };
        }

        
        const embeds = body.message.embeds || [];
        const footerText = (embeds.length > 0 && embeds[0]?.footer?.text) ? embeds[0].footer.text : "";

        
        const encounterMatch = footerText.match(/PokeID:([\w\d_-]+)/);

        if (!encounterMatch) {
            console.error("Encounter ID not found in the message footer.");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Encounter ID missing from message footer" }),
            };
        }

        const encounterID = encounterMatch[1];

        let pokemonData;
        try {
            const s3Response = await s3.getObject({ Bucket: bucketName, Key: filename }).promise();
            const allPokemonData = JSON.parse(s3Response.Body.toString());

            pokemonData = allPokemonData[encounterID];
            if (!pokemonData) throw new Error("Pokémon not found in JSON.");
        } catch (error) {
            console.error("Error fetching Pokémon data from S3:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to retrieve Pokémon data" }),
            };
        }

        const { name: pokemonName } = pokemonData; 

        let responseMessage;
        if (customId === 'default_pokeball') {
            responseMessage = `# <@${userID}> Caught ${pokemonName}!`;
        } else if (customId === 'great_ball') {
            responseMessage = `# <@${userID}> The Pokémon ran away!`;
        } else if (customId === "ultra_ball") {
            responseMessage = `# <@${userID}> used an **Ultra Ball** on ${pokemonName}!`;
        } else if (customId === "master_ball") {
            responseMessage = `# <@${userID}> used a **Master Ball** and caught ${pokemonName}!`;
        } else {
            responseMessage = "Unknown action.";
        }

        const updatedButtons = {
            type: 1,
            components: body.message.components[0].components.map(button => ({
                ...button,
                disabled: true
            }))
        };

        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 7, // Edit the original message
                data: {
                    content: responseMessage,
                    components: [updatedButtons]
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
