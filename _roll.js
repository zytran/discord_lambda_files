module.exports = async (body) => {
    let diceOption = body.data.options.find((option) => option.name === "dice");
    let rolledDice = diceOption.value.toLowerCase();

    let amountOption = body.data.options.find((option) => option.name === "amount");
    let amount = amountOption.value;

    let bonusOption = body.data.options.find((option) => option.name === "bonus");

    let advantageOption = body.data.options.find((option) => option.name === "advantage");

    const dice = {
        'd20': 20,
        'd10': 10,
        'd8': 8,
        'd6': 6,
        'd4': 4
    };

    let userRolls = "";

    if (!(rolledDice in dice)) {
        userRolls = `# **Dice Not Supported / Invalid Dice**\n> ## Currently Supported Dice\n> ### \`d20\`\n> ### \`d10\`\n> ### \`d8\`\n> ### \`d6\`\n> ### \`d4\`\n**For more dice to be added / support, message <@453602286162149377> on Discord**`;
    } else {
        const userID = body.member.user.id;
        userRolls = `## <@${userID}>'s rolls: `;

        let total = bonusOption ? bonusOption.value : 0;

        let nat1 = false;
        let nat20 = false;

        if (advantageOption) {
            if (!advantageOption.value) {
                total = 21;
                for (let i = 1; i <= amount; i++) {
                    let rolledAmount = Math.floor(Math.random() * dice[rolledDice]) + 1;
                    userRolls += `\n> Roll ${i}: **${rolledAmount}**`;

                    if (rolledAmount < total) {
                        total = rolledAmount;
                    }

                    if (rolledAmount === 1) {
                        nat1 = true;
                    }
                }

            }
            else{
                total = 0;
                for (let i = 1; i <= amount; i++) {
                    let rolledAmount = Math.floor(Math.random() * dice[rolledDice]) + 1;
                    userRolls += `\n> Roll ${i}: **${rolledAmount}**`;

                    if (rolledAmount > total) {
                        total = rolledAmount;
                    }

                    if (rolledAmount === 20) {
                        nat20 = true;
                    }
                }
            }
            if(!nat20 && !nat1){
                if (bonusOption) {
                    total+=bonusOption.value
                    userRolls += `\n> Bonus: **${bonusOption.value}**`;
                }
                userRolls += `\n> ### Total: **${total}**`;
            }
            else if(nat20 && total ==20){
                userRolls += `\n> ### Total: **${total}**`;
                userRolls+="\n## [Critical Success!](https://tenor.com/view/nat-20-baldur's-gate-baldur's-gate-3-critical-sucess-gif-14789122616741343796)";
            }
            else if (nat1 &&total==1){
                userRolls += `\n> ### Total: **${total}**`;
                userRolls+="\n## [Critical Failure!](https://tenor.com/view/baldur's-gate-3-critical-fail-critical-failure-%C3%A9chec-%C3%A9chec-critique-gif-15074420353830990571)"
            }
        
        } else {
            for (let i = 1; i <= amount; i++) {
                let rolledAmount = Math.floor(Math.random() * dice[rolledDice]) + 1;
                total += rolledAmount;
                userRolls += `\n> Roll ${i}: **${rolledAmount}**`;
            }

            if (bonusOption) {
                userRolls += `\n> Bonus: **${bonusOption.value}**`;
            }
            userRolls += `\n> ### Total: **${total}**`;
        }

        
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: { content: userRolls },
        }),
    };
};
