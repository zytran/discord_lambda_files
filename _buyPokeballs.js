// _addmoneyHandler.js
const { EmbedBuilder } = require('discord.js')
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const bucketName = "useramounts";
const moneyFile = "money.json";
const userBallsFile ='userPokeballs.json' // lol

module.exports = async (body) => {
    let pokeBallsOption = body.data.options.find((option) => option.name === "pokeballs");
    let amountOption = body.data.options.find((option)=>option.name==='amount')

    let pokeball = pokeBallsOption.value.lower();
    let amount = amountOption.value;

    let userAmount ='';
    const userId = body.member.user.id;
    const prices = {
        'pokeball':100,
        'poke ball':100,
        'poké ball':100,
        'pokéball':100,
        'greatball':500,
        'great ball':500,
        'ultraball':1000,
        'ultra ball':1000,
        'masterball':10000,
        'master ball': 10000
    };


    if (!(pokeball in prices)){
        const failedEmbed = new EmbedBuilder()
                    .setColor(0xFF2C2C)
                    .setTitle("Invalid Poké Ball")
                    .setURL("https://m.youtube.com/watch?v=YJAKnSvAs8Y&t=14s")
                    .setThumbnail('https://data.textstudio.com/output/sample/animated/5/8/7/5/test-3-5785.gif')
                    .addFields(
                        {name:'Reason',value:"Invalid Amount of Money (use /addmoney or /slots to fix)",inline:false},
                        {name:`$<@${userId}>'s Total`, value:userMoney[userId],inline:true},
                        {name:`Purchased Total`,value:`${prices[pokeball]*amount}`}
                    );   
    }
    try{
        let userMoney = {};
        try{
            const data = await s3.getObject({
                Bucket:bucketName,
                Key:moneyFile
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
            
            if (userMoney[userId] < (prices[pokeball]*amount)){
                const failedEmbed = new EmbedBuilder()
                    .setColor(0xFF2C2C)
                    .setTitle("Transaction Failed!")
                    .setURL("https://m.youtube.com/watch?v=YJAKnSvAs8Y&t=14s")
                    .setThumbnail('https://data.textstudio.com/output/sample/animated/5/8/7/5/test-3-5785.gif')
                    .addFields(
                        {name:'Reason',value:"Invalid Amount of Money (use /addmoney or /slots to fix)",inline:false},
                        {name:`$<@${userId}>'s Total`, value:userMoney[userId],inline:true},
                        {name:`Purchased Total`,value:`${prices[pokeball]*amount}`}
                    );   
            }


            await s3.putObject({
                Bucket: bucketName,
                Key: moneyFile,
                Body: JSON.stringify(userMoney,null,2),
                ContentType: "application/json"
            }).promise();

            
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

