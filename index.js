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

//Тесты

client.on('ready', () => {
    console.log('Я готов!');
});

client.on("message", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    switch (command) {
        case "command_full":
            let list = ``
            for (let i = 0; i < commandList.length; i++) {
                list += `${commandList[i]}, `;
            }
            message.reply(list);
            break;
        case "command":
            let answer = `Потом тут будут команды и объяснения`
            message.reply(answer);
            break;
        case "ping":
            const timeToken = Date.now() - message.createdTimestamp;
            message.reply(`Pong! Это сообщение имеет задержку ${timeToken}ms.`);
            break;
        case "sum":
            const numArgs = args.map(x => parseFloat(x));
            const sum = numArgs.reduce((counter, x) => counter += x);
            message.reply(`Сумма: ${sum}`);
            break;
        case "avatar":
            message.reply(message.author.displayAvatarURL());
            break;
        case "roll":
            const dice = args[0];
            let oneArgument;
            if (args[1] ?? false) {
                oneArgument = args[1].split('')
            }
            else {
                oneArgument = [false]
            }
            const diceFacet = dice.match(/(?<=d)\d+/);
            const diceNumber = dice.match(/\d+(?=d)/);
            const sumNumber = dice.match(/(?<=\+)\d+/);


        function standartRoll(diceNumber, diceFacet) {
            let result = [];
            for (let i = 0; i < diceNumber; i++) {
                result.push(Math.round(Math.random() * (diceFacet - 1) + 1));
            }
            return result;
        }

        function boomRoll(oneArgument, arrDice) {
            let result = arrDice;
            const boomFacet = oneArgument.splice(1);
            const transferBoundary = boomFacet.map(i => x += i, x = 0).reverse()[0]
            for (let i = 0; i < diceNumber; i++) {
                if (result[i] >= transferBoundary) {
                    result.push(Math.round(Math.random() * (diceFacet - 1) + 1));
                }
            }
            return result;
        }

        function infiniteBoomRoll(oneArgument, arrDice) {
            let result = arrDice;
            const boomFacet = oneArgument.splice(2);
            const transferBoundary = boomFacet.map(i => x += i, x = 0).reverse()[0]
            for (let i = 0; i < result.length; i++) {
                if (result[i] >= transferBoundary) {
                    result.push(Math.round(Math.random() * (diceFacet - 1) + 1));
                } else if (result.length > 100) {
                    break;
                }
            }
            return result;
        }


        function finalRoll(sumNumber, resultDice) {
            let sum = resultDice.reduce((partial_sum, a) => partial_sum + a, 0);
            let result = ``;
            if (sumNumber !== null) {
                result += `\nМодификатор: ${sumNumber};`;
                sum = Number(sum) + Number(sumNumber);
                result += `\nИтого: ${sum}.`;
                return result;
            } else {
                result += `\nИтого: ${sum};`;
                return result;
            }
        }

        function boomFinalRoll(resultDice, totalDice) {
            let result = ''
            const boomDice = resultDice.splice(diceNumber);
            result += `\nВзрыв костей: [${boomDice.join(", ")}];`;
            result += totalDice;
            return result;
        };

        function successFinalRoll(oneArgument, resultDice) {
            let result = ''
            const thresholdDice = oneArgument.splice(1).map(i => x += i, x = 0).reverse()[0];
            result += `\nЧисло успехов: `;
            let successfulDice = 0;
            for (let i = 0; i < resultDice.length; i++) {
                if (resultDice[i] >= thresholdDice) {
                    successfulDice += 1;
                }
            }
            result += successfulDice;
            return result;
        }

        function fateRoll(arrDice, sumNumber) {
            let result = ``
            let faceAddition = 0
            for (let i = 0; i < arrDice.length; i++) {
                let fateObj = {
                    1 : "-",
                    2 : "=",
                    3 : "+",
                }
                arrDice[i] = fateObj[arrDice[i]] || console.log("Неверный тип данных");
            }
            result = `[${arrDice.map(String)}]`;
            for (let i = 0; i < arrDice.length; i++) {
                let fateObj = {
                    "-" : -1,
                    "=" : 0,
                    "+" : 1,
                }
                faceAddition += fateObj[arrDice[i]] ?? console.log("Неверный тип данных");
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

            if (oneArgument[0] ?? false) {
                let arrDice = standartRoll(diceNumber, diceFacet);
                let finalDice = finalRoll(sumNumber, arrDice);
                const diceObj = {
                    'e' : `[${boomRoll(oneArgument, arrDice)}] 
                    ${boomFinalRoll(arrDice, finalDice)}`,
                    'i' : `[${infiniteBoomRoll(oneArgument, arrDice)}] 
                    ${boomFinalRoll(arrDice, finalDice)}`,
                    //Придумать как оформить и оптимизировать
                    't' : `[${arrDice}] ${successFinalRoll(oneArgument, arrDice)}`,
                }
                let result = diceObj[oneArgument[0]] || 'К сожалению такой команды нет'
                message.reply(result)
            } else {
                if (diceFacet !== null) {
                    const arrDice = standartRoll(diceNumber, diceFacet);
                    const sumDice = finalRoll(sumNumber, arrDice);
                    message.reply(`[${arrDice.join(", ")}] ${sumDice}`);
                } else if (diceFacet === null) {
                    const arrDice = standartRoll(diceNumber, 3);
                    const result = fateRoll(arrDice, sumNumber);
                    message.reply(result);
                }
            }
            break;
        default:
            console.log("Некорректная команда");
    }

})
;
client.login(config.BOT_TOKEN);