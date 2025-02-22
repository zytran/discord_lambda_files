//randomCommandHandler.js

module.exports = function (body) {
  // Extract options from the interaction
  const randomOption = body.data.options.find((option) => option.name === 'random');
  const randomGame = randomOption.value;

  
  const eightBallResponses = randomGame.split(",");
  //const greetingMessage = gameOption ? gameOption.value : 'xDDD.';
  const randomResponse = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];
  //const randomResponse = "hello"
  // Customize the response message based on the options
  const responseMessage = `<@${body.member.user.id}>'s list: ${randomGame}\n**Random Item: ${randomResponse}** `;

  return {
    statusCode: 200,
    body: JSON.stringify({
      type: 4,
      data: { content: responseMessage },
    }),
  }
};
