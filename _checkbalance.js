const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const bucketName = "useramounts";
const fileName = "money.json";

module.exports = async(body)=>{
    const userId = body.member.user.id;
    let userBalance = ``;
    let userMoney = {};
    try{
        
        try{
            const data = await s3.getObject({
                Bucket:bucketName,
                Key:fileName
            }).promise();
            userMoney = JSON.parse(data.Body.toString());
        }
        catch(err){
            if (err.code==="NoSuchKey"){
                console.log("money.json not found creating a new one");                
            }
            else{
                console.error("Errror fetching money.json",err);
                throw err
            }
        }
        if (!userMoney[userId]){
            userMoney[userId] = 0;
        }
    }catch(err){
        console.error("Error updating money.json",err);
        userBalance = "Error Retrieving Balance";
    }
    userBalance = `**<@${userId}>'s balance: $${userMoney[userId]}**`
    return{
        statusCode: 200,
        body: JSON.stringify({
            type:4,
            data:{content:userBalance},
        }),
    };
};