const { EmbedBuilder } = require('discord.js');

module.exports = async (body) => {
    const fetch = (await import('node-fetch')).default;
    const randomPokemon = Math.floor(Math.random() * 1025) + 1;
    const pokemonLevel = Math.floor(Math.random() * 100) + 1;

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

    const pokeEmbed = new EmbedBuilder()
        .setColor(pokemonColors[color] || 0x000000) 
        .setTitle(`A Wild ${pokemonName} Appeared`)
        .setURL(`https://www.pokemon.com/us/pokedex/${formattedPokemonName}/`)
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
            {name: "Pokedex Entry", value: `[Link](https://www.pokemon.com/us/pokedex/${formattedPokemonName}/)`,inline:true},
            {name:"Ability", value: randomAbility.charAt(0).toUpperCase()+randomAbility.slice(1), inline:true},

        )
        .setImage(`https://img.pokemondb.net/artwork/${formattedPokemonName}.jpg`)
        .setTimestamp()
        .setFooter({
            text: "Developed by @Yoshingo",
            iconURL: 'https://i.imgur.com/IlcxbcC.jpeg'
        });

    const embedJson = pokeEmbed.toJSON();

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({
            type: 4,
            data: {
                content: `# <@${userId}>`,
                embeds: [embedJson],
            },
        }),
    };
};
