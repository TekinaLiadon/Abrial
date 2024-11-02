import Event from "../structures/Event";
import {GuildMember, TextChannel} from "discord.js";
import {primaryEmbed} from "../utils/embeds";
import pg from 'pg'
const { Pool } = pg

let cashList = []
export default class GuildBanAddEvent extends Event {
    constructor() { super('messageCreate', 'messageCreate'); };

    async exec(member: GuildMember) {
        if(cashList.length === 0) {
            const pool = new Pool()
            const channel_id = await pool.query('SELECT channel_id FROM channel WHERE guild_id = $1 AND type=$2', [member.guild.id, "creativity"])
            if(channel_id.rows[0]?.channel_id) cashList.push(Number(channel_id.rows[0]?.channel_id))
        }
        if(Number(member.channel.id) !== cashList[0]) return
        if(member.attachments.size > 0) {
            const attachment = member.attachments.first()
            if (attachment.contentType.startsWith('image/')) {
                member.reply({
                    embeds: [
                        primaryEmbed('Молодец', 'Продолжай в том же духе. Вот твои 100 очков')
                    ]
                })
            }
        } else if(!member.author.bot) {
            const channel : TextChannel = member.guild.channels.cache.get(member.channel.id) as TextChannel
            await member.delete()
            if(channel) channel.send({
                embeds: [
                    primaryEmbed(`Нарушаешь?`, `Пользователь <@${member.author.id}> решил пообщаться вместо скидывания творчества. Не надо так.`)
                ]
            })
        }
    }
}