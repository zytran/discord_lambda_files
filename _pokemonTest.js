const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const bucketName = "useramounts";
const filename = "currentPokemon.json";

module.exports = async (body) => {
    const fetch = (await import('node-fetch')).default;
    let randomPokemon = Math.floor(Math.random() * 1025) + 1;
    const pokemonLevel = Math.floor(Math.random() * 100) + 1;
    

    const pokeID = Date.now()+Math.floor(Math.random()*10000) + randomPokemon;
    // Fetch Pokémon data
    let data;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}/`);
        if (!response.ok) throw new Error(`Failed to fetch Pokémon: ${response.status}`);
        data = await response.json();
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch Pokémon" }) };
    }

    const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const formattedPokemonName = pokemonName.toLowerCase().replace(/\s+/g, "-");

    const pokemonAbilities = data.abilities;
    const randomAbility = pokemonAbilities.length > 0 
        ? pokemonAbilities[Math.floor(Math.random() * pokemonAbilities.length)].ability.name 
        : "Unknown"; 

    let formattedAbility = randomAbility
        .split('-')
        .map(word=>word.charAt(0).toUpperCase() +word.slice(1))
        .join(" ");

    
    let types = data.types
        .map(typeInfo => typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1))
        .join(" and ");

    
    let speciesData;
    try {
        const speciesResponse = await fetch(data.species.url);
        if (!speciesResponse.ok) throw new Error(`Failed to fetch Pokémon species: ${speciesResponse.status}`);
        speciesData = await speciesResponse.json();
    } catch (error) {
        console.error("Error fetching species data:", error);
        speciesData = { color: { name: "gray" } }; 
    }

    const color = speciesData.color.name;

    const userId = body.member.user.id;

    const pokemonColors = {
        "black": 0x323232,
        "blue": 0x3B9CFF,
        "brown": 0xA56D4F,
        "gray": 0x8B8B8B,
        "green": 0x1DBC60,
        "pink": 0xFF91A4,
        "purple": 0xA63DE3,
        "red": 0xE24242,
        "white": 0xEDEDED,
        "yellow": 0xF9D030
    };

    const pokemonData = {
        id:randomPokemon,
        name:pokemonName,
        level: pokemonLevel,
        type: types,
        ability: formattedAbility,
        img: `https://img.pokemondb.net/artwork/${formattedPokemonName}.jpg`,
        encounter: pokeID
    }; 

    let passedData = {};

    try {
        // Fetch the existing JSON data
        const s3Response = await s3.getObject(
            { Bucket: bucketName, 
            Key: filename }).promise();
        allPokemonData = JSON.parse(s3Response.Body.toString());
    } catch (error) {
        if (error.code === "NoSuchKey") {
            console.log("No existing file found, creating a new one.");
        } else {
            console.error("Error fetching Pokémon data from S3:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to retrieve Pokémon data" }),
            };
        }
    }

    allPokemonData[pokeID] = pokemonData;

    await s3.putObject({
        Bucket: bucketName,
        Key:filename,
        Body: JSON.stringify(allPokemonData,null,2),
        ContentType:"application/json"
    }).promise();

    const pokeEmbed = new EmbedBuilder()
        .setColor(pokemonColors[color] || 0x000000) 
        .setTitle(`A Wild ${pokemonName} Appeared!`)
        .setURL(`https://www.pokemon.com/us/pokedex/${speciesData.name}/`)
        .setAuthor({
            name: `${pokemonName}`,
            iconURL: `https://img.pokemondb.net/artwork/${formattedPokemonName}.jpg`
        })
        .setThumbnail('https://i.imgur.com/olQInPy.png')
        .addFields(
            { name: "Type", value: types, inline: true },
            { name: "Level", value: pokemonLevel.toString(), inline: true },
        )
        .addFields({
            name: " ", value: " "
        })
        .addFields(
            {name: "Pokedex Entry", value: `[Link](https://www.pokemon.com/us/pokedex/${speciesData.name}/)`,inline:true},
            {name:"Ability", value: `[${formattedAbility}](https://pokemondb.net/ability/${randomAbility})`, inline:true},
            

        )
        .setImage(`https://img.pokemondb.net/artwork/${speciesData.name}.jpg`)
        .setTimestamp()
        .setFooter({
            text: `PokeID:${pokeID}`
        });

    const embedJson = pokeEmbed.toJSON();
    
    const defaultPokeball = new ButtonBuilder()
        .setCustomId("default_pokeball")
        .setLabel("Poké Ball")
        .setStyle(ButtonStyle.Danger);
    const greatBall = new ButtonBuilder()
        .setCustomId("great_ball")
        .setLabel("Great Ball")
        .setStyle(ButtonStyle.Primary);
    const ultraBall = new ButtonBuilder()
        .setCustomId("ultra_ball")
        .setLabel("Ultra Ball")
        .setStyle(ButtonStyle.Secondary);
    const masterBall = new ButtonBuilder()
        .setCustomId('master_ball')
        .setLabel("Master Ball")
        .setStyle(ButtonStyle.Success);
    

    const row = new ActionRowBuilder().addComponents(defaultPokeball,greatBall,ultraBall,masterBall);

    const rowJson = row.toJSON();
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({
            type: 4,
            data: {
                content: `# <@${userId}>`,
                embeds: [embedJson],
                components:[rowJson], 
            },
        }),
    };
};
