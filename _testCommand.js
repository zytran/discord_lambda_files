const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const bucketName = "useramounts"; // S3 Bucket Name
const fileName = "money.json"; // S3 File Name

module.exports = async (body) => {
  
  let messageOption = body.data.options.find((option) => option.name === 'amount');
  let gambleAmount = messageOption.value;

  const slotNumbers = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"]; 

  let num1 = slotNumbers[Math.floor(Math.random() * slotNumbers.length)];
  let num2 = slotNumbers[Math.floor(Math.random() * slotNumbers.length)];
  let num3 = slotNumbers[Math.floor(Math.random() * slotNumbers.length)];

  // Get the user ID
  const userId = body.member.user.id;
  const hostID = "453602286162149377"; // Host ID (string for comparison)
  
  /*if (userId === hostID) {
     //Force win for host
    num1 = ":seven:";
    num2 = ":seven:";
    num3 = ":seven:";
  }
  */
  let slotSelection = `:red_square::white_large_square::red_square::white_large_square::red_square:\n:fast_forward:${num1}${num2}${num3}:blue_square:\n:red_square::white_large_square::red_square::white_large_square::red_square:`;

  // Check if user won
  if (num1 === num2 && num2 === num3) {
    slotSelection += `\n<@${userId}> Won Big!!!`;

    try {
      // Fetch existing money.json from S3
      let userMoney = {};

      try {
        const data = await s3.getObject({
          Bucket: bucketName,
          Key: fileName
        }).promise();
        
        userMoney = JSON.parse(data.Body.toString());
      } catch (err) {
        if (err.code === "NoSuchKey") {
          console.log("money.json not found, creating a new one.");
        } else {
          console.error("Error fetching money.json:", err);
          throw err;
        }
      }

      // Initialize user balance if not already in the file
      if (!userMoney[userId]) {
        userMoney[userId] = 100;
      }

      // Update user's balance
      userMoney[userId] += 10* gambleAmount;

      

      // Save updated money.json back to S3
      await s3.putObject({
        Bucket: bucketName,
        Key: fileName,
        Body: JSON.stringify(userMoney, null, 2),
        ContentType: "application/json"
      }).promise();

      slotSelection += `\n💰 Your new balance: ${userMoney[userId]}`;
      
    } catch (err) {
      console.error("Error updating money.json:", err);
      slotSelection += "\n⚠️ *Error updating money record. Please try again later.*";
    }
  }
  else {
    try {
      // Fetch existing money.json from S3
      let userMoney = {};

      try {
        const data = await s3.getObject({
          Bucket: bucketName,
          Key: fileName
        }).promise();
        
        userMoney = JSON.parse(data.Body.toString());
      } catch (err) {
        if (err.code === "NoSuchKey") {
          console.log("money.json not found, creating a new one.");
        } else {
          console.error("Error fetching money.json:", err);
          throw err;
        }
      }

      // Initialize user balance if not already in the file
      if (!userMoney[userId]) {
        userMoney[userId] = 100;
      }

      // Update user's balance
      userMoney[userId] -= gambleAmount;

      // Save updated money.json back to S3
      await s3.putObject({
        Bucket: bucketName,
        Key: fileName,
        Body: JSON.stringify(userMoney, null, 2),
        ContentType: "application/json"
      }).promise();

      slotSelection += `\n💰 Your new balance: ${userMoney[userId]}`;
      
    } catch (err) {
      console.error("Error updating money.json:", err);
      slotSelection += "\n⚠️ *Error updating money record. Please try again later.*";
    }
  }

  //slotSelection += "\n\n**This is a test command. Values are now stored in S3!**";

  // Return response to Discord
  return {
    statusCode: 200,
    body: JSON.stringify({
      type: 4,
      data: { content: slotSelection },
    }),
  };
};