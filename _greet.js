//testCommandHandler.js

module.exports = function (body) {
  // Extract options from the interaction
  const gameOption = body.data.options.find((option) => option.name === 'game');
  const randomGame = gameOption.value;
  
  //const eightBallResponses = randomGame.split(",");
  //const greetingMessage = gameOption ? gameOption.value : 'xDDD.';
  //const randomResponse = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];
  const randomResponse = "hello"
  // Customize the response message based on the options
  const responseMessage = `<@${body.member.user.id}> Asked: ${randomGame}\n**8Ball Answered:** ${randomResponse} `;

  return {
    statusCode: 200,
    body: JSON.stringify({
      type: 4,
      data: { content: responseMessage },
    }),
  }
};

