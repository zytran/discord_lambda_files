// _addmoneyHandler.js

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const bucketName = "useramounts";
const fileName = "money.json";

module.exports = async (body) => {
    let messageOption = body.data.options.find((option) => option.name === "amount");
    let addedAmount = messageOption.value;
    let userAmount ="";
    const userId = body.member.user.id;

    try{
        let userMoney = {};
        try{
            const data = await s3.getObject({
                Bucket:bucketName,
                Key:fileName
            }).promise();
            userMoney = JSON.parse(data.Body.toString());
        }
        catch(err){
            if (err.code === "NoSuchKey"){
                console.log("money.json not found, creating a new one");}
            else{
                console.error("Error fetching money.json",err);
                throw err;
            }
            }

            if (!userMoney[userId]){
                userMoney[userId] = 0
            }
            userMoney[userId] += addedAmount ;


            await s3.putObject({
                Bucket: bucketName,
                Key: fileName,
                Body: JSON.stringify(userMoney,null,2),
                ContentType: "application/json"
            }).promise();

            userAmount = `<@${userId}>'s new balance: ${userMoney[userId]}`
        } catch(err){
            console.error("Error updating money.json: ",err);
            userAmount = "Error updating money record";
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                type:4,
                data:{content:userAmount},
            }),
        };
    };

