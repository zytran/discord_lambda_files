// This fuction is a way for the both me and the user to know what commands are available

module.exports = async(body)=> {
    
    const userID = body.member.user.id;

    let userMessage = `# Hello <@${userID}> this is a list of all the commands currently available, with all the parameters available:\n\n`;
    userMessage+= `\`/hello\`: Greets the user with a message`
    userMessage+= `\n\`/random\`: Gives a random value form the given list\n\`Arguments:\`\n> \`random:\` Random list **Must be seperated by commas**`



    return{
        statusCode: 200,
        body: JSON.stringify({
            type:4,
            data:{content:userMessage},
        }),
    };
};