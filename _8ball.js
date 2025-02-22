//testCommandHandler.js

module.exports = function (body) {
  // Extract options from the interaction
  const messageOption = body.data.options.find((option) => option.name === 'question');
  const eightBallResponses = [
      "*It is certain.*",
      "*It is decidedly so.*",
      "*Without a doubt.*",
      "*Yes – definitely.*",
      "*You may rely on it.*",
      "*As I see it, yes.*",
      "*Most likely.*",
      "*Outlook good.*",
      "*Yes.*",
      "*Signs point to yes.*",
      "*Reply hazy, try again.*",
      "*Ask again later.*",
      "*Better not tell you now.*",
      "*Cannot predict now.*",
      "*Concentrate and ask again.*",
      "*Don't count on it.*",
      "*My reply is no.*",
      "*My sources say no.*",
      "*Outlook not so good.*",
      "*Very doubtful.*"
    ];
  if (true) {
    
    const greetingMessage = messageOption ? messageOption.value : 'xDDD.';
    const randomResponse = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];
    // Customize the response message based on the options
    const responseMessage = `<@${body.member.user.id}> Asked: ${greetingMessage}\n**8Ball Answered:** ${randomResponse} `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 4,
        data: { content: responseMessage },
      }),
    };
  }
};

