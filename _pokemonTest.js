const {EmbedBuilder} = require('discord.js')
module.exports = async(body)=>{
  const fetch = (await import('node-fetch')).default;
  const randomPokemon = Math.floor(Math.random()*1025)+1;
  const pokemonLevel = Math.floor(Math.random()*100)+1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}/`);
  const data = await response.json();
 
  const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  let types = data.types
    .map(typeInfo => typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1))
    .join(" and ");

    const speciesResponse = await fetch(data.species.url);
    if (!speciesResponse.ok) throw new Error(`Failed to fetch Pokémon species: ${speciesResponse.status}`);

    const speciesData = await speciesResponse.json();
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
    .setColor(pokemonColors[color] || "0x000000")
    .setTitle(`A Wild ${pokemonName} Appeared`) 
    .setURL(`https://www.pokemon.com/us/pokedex/${pokemonName.toLowerCase()}/`)
    .setAuthor({name: `${pokemonName}` ,iconURL: 'https://i.imgur.com/IlcxbcC.jpeg'})
    .addFields(
        
        {name: "Type", value: types, inline:true},
        {name: "Level", value:pokemonLevel,inline:true}
    )
    .addFields({name: "Pokedex Entry",value: `[Link](https://www.pokemon.com/us/pokedex/${pokemonName.toLowerCase()}/)`})
    .setImage('https://i.imgur.com/IlcxbcC.jpeg')
    .setTimestamp()
    .setFooter({text:"Developed by @Yoshingo", iconURL: 'https://i.imgur.com/IlcxbcC.jpeg'})


    const embedJson = pokeEmbed.toJSON();
    
return {
    statusCode: 200,
    body: JSON.stringify({
        type: 4,
        data: {
            content: `# <@${userId}>`,
            embeds:[embedJson],
        },
    }),
};
}

