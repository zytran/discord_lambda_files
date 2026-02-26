const nacl = require('tweetnacl');
const handleButtonClick = require('./_handleButtonClick');

const commandHandlers = {
  hello: require('./_hello'),
  greet: require('./_greet'),
  '8ball': require('./_8ball'),
  test: require('./_testCommand'),
  random: require('./_random'),
  slots: require('./_slots'),
  addmoney: require('./_addmoney'),
  checkbalance: require('./_checkbalance'),
  roll: require('./_roll'),
  summonpokemon: require('./_pokemonTest'),
  dndon: require('./_dndnames.'),
  dndoff: require('./dndoff')
};


exports.handler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Ensure event.body exists and is a string
    if (!event.body) {
      throw new Error("event.body is undefined or empty");
    }

    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const signature = event.headers['x-signature-ed25519'];
    const timestamp = event.headers['x-signature-timestamp'];
    const strBody = event.body;

    // Verify request signature
    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + strBody),
      Buffer.from(signature, 'hex'),
      Buffer.from(PUBLIC_KEY, 'hex')
    );

    if (!isVerified) {
      return { statusCode: 401, body: JSON.stringify('invalid request signature') };
    }

    const body = JSON.parse(strBody);

    
    if (body.type === 1) {
      return { statusCode: 200, body: JSON.stringify({ type: 1 }) };
    }

    if (body.type === 3) {
      return handleButtonClick(event);
    }

    const commandName = body.data.name;
    if (commandHandlers[commandName]) {
      return commandHandlers[commandName](body);
    }

    return { statusCode: 404, body: JSON.stringify('Not Found') };

  } catch (error) {
    console.error("Error processing request:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", message: error.message }),
    };
  }
};
