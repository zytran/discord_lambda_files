module.exports = function (body) {
    const slotNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]; // Change to emojis later
    
    const fs = require("fs");
    const path = "./money.json";
  
    let num1 = slotNumbers[Math.floor(Math.random() * slotNumbers.length)];
    let num2 = slotNumbers[Math.floor(Math.random() * slotNumbers.length)];
    let num3 = slotNumbers[Math.floor(Math.random() * slotNumbers.length)];
  
    // Test win condition
    //num1 = "7";
    //num2 = "7";
    //num3 = "7";
  
    let slotSelection = `:red_square::white_large_square::red_square::white_large_square::red_square:\n:fast_forward:${num1} ${num2} ${num3}:blue_square:\n:red_square::white_large_square::red_square::white_large_square::red_square:`;
  
    // Get user's ID
    const userId = body.member.user.id;
  
    // Check if user won
    if (num1 === num2 && num2 === num3) {
      slotSelection += `\n<@${userId}> Won Big!!!`;
  
      // Read and update money.json
      let userMoney = JSON.parse(fs.readFileSync(path, "utf-8"));
  
      
      if (!userMoney[userId]) {
        userMoney[userId] = 0; // Initialize if user doesn't exist
      }
      
      userMoney[userId] += 100; // Add winnings (change amount as needed)
  
      // Save updated money.json
      //fs.writeFileSync("./money.json", JSON.stringify(userMoney, null, 2), "utf-8");
  
    }
  
    slotSelection+=`\n\n**This is a test command. No values are saved and will be added at a later date**`
  
    // Return response to Discord
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 4,
        data: { content: slotSelection },
      }),
    };
  };
  