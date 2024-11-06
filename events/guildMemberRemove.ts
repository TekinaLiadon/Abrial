
import Event from "../structures/Event";
import {GuildMember, TextChannel, AuditLogEvent} from "discord.js";
import {primaryEmbed} from "../utils/embeds";
import db from "../structures/Db";

let channel_id
export default class GuildMemberRemoveEvent extends Event {
    constructor() { super('guildMemberRemove', 'guildMemberRemove'); };

    async exec(member: GuildMember) {
        if(!channel_id) {
            const sqlResult = await db.pool('SELECT channel_id FROM channel WHERE guild_id = $1 AND type=$2', [member.guild.id, "welcome"])
            channel_id = sqlResult.channel_id
        }
        const welcome : TextChannel = member.guild.channels.cache.get(channel_id) as TextChannel // id chanel
        /*const auditLogs = await member.guild.fetchAuditLogs( { type: 20 }); // enum AuditLogEvent
        const kickLog = auditLogs.entries.first();*/
        // Адекватно нельзя придумать, сам ушел пользователь или его кикнули и нужны костыли. + тут запрос на бан у сайта
        if(welcome) welcome.send({
            embeds: [
                primaryEmbed(`Прощай`, `Пользователь <@${member.id}> покинул сервер `)
            ]
        })


    }


}