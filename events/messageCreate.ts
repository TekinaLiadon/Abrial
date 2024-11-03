import Event from "../structures/Event";
import {GuildMember, TextChannel} from "discord.js";
import {primaryEmbed} from "../utils/embeds";
import pg from 'pg'
const { Pool } = pg
import db from "../structures/Db";

let cashList = []
let logId
export default class MessageCreateEvent extends Event {
    constructor() { super('messageCreate', 'messageCreate'); };

    async exec(member: GuildMember) {
        if(cashList.length === 0) {
            const channel_id = await db.pool('SELECT channel_id FROM channel WHERE guild_id = $1 AND type=$2', [member.guild.id, "creativity"])
            const channel_log = await db.pool('SELECT channel_id FROM channel WHERE guild_id = $1 AND type=$2', [member.guild.id, "welcome"])
            if(channel_id?.channel_id) cashList.push(Number(channel_id?.channel_id))
            if(channel_log?.channel_id) logId = channel_log?.channel_id
        }
        if(Number(member.channel.id) !== cashList[0]) return
        if(member.attachments.size > 0) {
            const attachment = member.attachments.first()
            if (attachment.contentType.startsWith('image/')) {
                const pool = new Pool()
                const counter = await pool.query('SELECT img_count, update_img FROM bot_character WHERE discord_id = $1', [member.author.id])
                const {img_count, update_img} = counter.rows[0]
                const now = new Date();
                const timeDifference = Math.abs(now - new Date(update_img))
                const hoursDifference = timeDifference / (1000 * 60 * 60)
                const log: TextChannel = member.guild.channels.cache.get(logId) as TextChannel;
                console.log(img_count, hoursDifference)
                if(img_count >= 1 && hoursDifference < 23) {
                    log.send({
                        embeds: [
                            primaryEmbed('Воу, воу, полегче', `${member.author.globalName}, ты слишком активен. Это не плохо, но я не могу за это начислить тебе очки`)
                        ],
                    })
                } else {
                    const now = new Date();
                    const isoString = now.toISOString()
                    await pool.query('UPDATE bot_character SET points = points + $1, update_img= $3, img_count = img_count + $4 WHERE discord_id = $2', [100, member.author.id, isoString, 1])
                    log.send({
                        embeds: [
                            primaryEmbed('Молодец', `Продолжай в том же духе ${member.author.globalName}. Вот твои 100 очков`)
                        ],
                    })
                }
            }
        } else if(!member.author.bot) {
            const log: TextChannel = member.guild.channels.cache.get(logId) as TextChannel;
            await member.delete()
            if(log) log.send({
                embeds: [
                    primaryEmbed(`Нарушаешь?`, `Пользователь <@${member.author.id}> решил пообщаться вместо скидывания творчества. Не надо так.`)
                ],
            })
        }
    }
}