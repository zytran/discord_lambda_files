//roll command handler

module.exports = async (body) => {
    let diceOption = body.data.options.find((option)=>option.name==="dice");
    let rolledDice = diceOption.value;
    rolledDice = rolledDice.toLowerCase()


    let amountOption = body.data.options.find((option)=>option.name==="amount");
    let amount = amountOption.value;

    const bonusOption = body.data.options.find((option)=>option.name==="bonus");

    const dice = {
        'd20':20,
        'd10':10,
        'd8':8,
        'd6':6,
        'd4':4
    }

    const userID = body.member.user.id
    let userRolls = `## <@${userID}>'s rolls: `
    
    let total = bonusOption ? bonusOption.value: 0
    
    let nat1 = false
    let nat20 = false

    for (i = 1; i<amount+1;i++){
        let rolledAmount = Math.floor(Math.random()*dice[rolledDice]);
        total += rolledAmount
        userRolls+=`\n> Roll ${i}: **${rolledAmount}**`
    }

    if (!bonusOption){
        userRolls+=`\n> Bonus: **${bonusOption.value}**`
    }
    userRolls+=`\n> ### Total: **${total}**`

    return{
        statusCode:200,
        body: JSON.stringify({
            type:4,
            data: {content: userRolls},
        }),
    };
};   