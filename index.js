const Discord = require("../node_modules/discord.js");
const config = require("../token.json");
const fs = require('fs');

const client = new Discord.Client();
const prefix = "!";
const commandList = [
    "command_full",
    "command",
    "ping",
    "sum",
    "avatar",
    "roll",
];

client.on('ready', () => {
    console.log('Я готов!');
});

client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'command_full') {
        let list = ``
        for (let i = 0; i < commandList.length; i++) {
            list += `${commandList[i]}, `;
        }
        message.reply(list);
    }
    else if (command === "command") {
        let answer = `Потом тут будут команды и объяснения`
        message.reply(answer);
    }
    else if (command === "ping") {
        const timeToken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! Это сообщение имеет задержку ${timeToken}ms.`);
    }
    else if (command === "sum") {
        const numArgs = args.map(x => parseFloat(x));
        const sum = numArgs.reduce((counter, x) => counter += x);
        message.reply(`Сумма: ${sum}`);
    }
    else if (command === "avatar") {
            message.reply(message.author.displayAvatarURL());
        }
    else if (command === "roll") {
        const dice = args[0];
        const oneArgument = args[1].split('')
        const diceFacet = dice.match(/(?<=d)\d+/);
        const diceNumber = dice.match(/\d+(?=d)/);
        const sumNumber = dice.match(/(?<=\+)\d+/);

        function standartDice (diceNumber, diceFacet, oneArgument) {
            let result = [];
                for (let i = 0; i < diceNumber; i++) {
                    result.push(Math.round(Math.random() * (diceFacet - 1) + 1));
            }
            if (oneArgument[0] === "e") {
                const boomFacet = oneArgument.splice(1);
                const transferBoundary = boomFacet.map(i=>x+=i, x=0).reverse()[0]
                for (let i = 0; i < diceNumber; i++) {
                    if (result[i] >= transferBoundary){
                        result.push(Math.round(Math.random() * (diceFacet - 1) + 1));
                    }
                }
            }
            else if (oneArgument[0] ==="i"){
                const boomFacet = oneArgument.splice(2);
                const transferBoundary = boomFacet.map(i=>x+=i, x=0).reverse()[0]
                for (let i = 0; i < result.length; i++) {
                    if (result[i] >= transferBoundary){
                        result.push(Math.round(Math.random() * (diceFacet - 1) + 1));
                    } else if (result.length > 100 ) {
                        break;
                    }
                }
            }
            return result;

        }
        function finalDice (sumNumber, resultDice, diceNumber, oneArgument) {
            let sum = resultDice.reduce((partial_sum, a) => partial_sum + a, 0);
            let result = ``;
            if (resultDice.length > diceNumber) {
                const boomDice = resultDice.splice(diceNumber);
                result += `\nВзрыв костей: [${boomDice}];`;
            }
            if (oneArgument[0] ==="t"){
                const thresholdDice = oneArgument.splice(1).map(i=>x+=i, x=0).reverse()[0];
                console.log(thresholdDice)
                result += `\nЧисло успехов: `;
                let successfulDice = [];
                for (let i = 0; i < resultDice.length; i++) {
                    if(resultDice[i] >= thresholdDice) {
                        successfulDice.push(1);
                        console.log(successfulDice)
                    }
                    if (i === resultDice.length ) {
                        successfulDice.map(i=>x+=i, x=0).reverse()[0];
                        result += successfulDice;
                    }
                }
                return result;
            }
            else if (sumNumber !== null) {
                result += `\nМодификатор: ${sumNumber};`;
                sum = Number(sum) + Number(sumNumber);
                result += `\nИтого: ${sum}.`;
                return result;
            }  else {
                    result += `\nИтого: ${sum};`;
                    return result;
                }
        }
        function fateDice (arrDice, sumNumber) {
            let result = ``
            let faceAddition = 0
            for (let i = 0; i < arrDice.length; i++) {
                switch (arrDice[i]) {
                    case 1:
                        arrDice[i] = "-"
                        break;
                    case 2:
                        arrDice[i] = "="
                        break;
                    case 3:
                        arrDice[i] = "+"
                        break;
                    default:
                        console.log("Неверный тип данных");
                }
            }
            result = `[${arrDice.map(String)}]`;
            for (let i = 0; i < arrDice.length; i++) {
                switch (arrDice[i]) {
                    case "-":
                        faceAddition += -1
                        break;
                    case "=":
                        break;
                    case "+":
                        faceAddition += 1
                        break;
                    default:
                        console.log("Неверный тип данных");
                }
            }
            if (sumNumber !== null) {
                result += `\nМодификатор: ${sumNumber};`;
                faceAddition += Number(sumNumber);
                result += `\nИтого: ${faceAddition}.`;
                return result;
            } else {
                result += `\nИтого: ${faceAddition};`;
                return result;
            }
        }

        if (oneArgument[0] === "e") {
            const arrDice = standartDice(diceNumber, diceFacet, oneArgument);
            const sumDice = finalDice(sumNumber, arrDice, diceNumber);
            message.reply(`[${arrDice}] ${sumDice}`);
        }
        else if(oneArgument[0] ==="i"){
            const arrDice = standartDice(diceNumber, diceFacet, oneArgument);
            const sumDice = finalDice(sumNumber, arrDice, diceNumber);
            message.reply(`[${arrDice}] ${sumDice}`);
            //Придумать как оформить и оптимизировать
        }
        else if (oneArgument[0] ==="t"){
            const arrDice = standartDice(diceNumber, diceFacet, oneArgument);
            const sumDice = finalDice(sumNumber, arrDice, diceNumber, oneArgument);
            message.reply(`[${arrDice}] ${sumDice}`);
            //Починить
        }
        else if (diceFacet !== null) {
            const arrDice = standartDice(diceNumber, diceFacet);
            const sumDice = finalDice(sumNumber, arrDice);
            message.reply(`[${arrDice}] ${sumDice}`);
        }
        else if (diceFacet === null) {
            const arrDice = standartDice(diceNumber, 3);
            const result = fateDice(arrDice, sumNumber);
            message.reply(result);
        }
    }

});

/*client.on("collect", function(){
    if (collect.message !== 873535111369482240) return;
    emoji.message
});*/
client.login(config.BOT_TOKEN);