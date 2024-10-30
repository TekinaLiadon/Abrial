
import Event from "../structures/Event";
import {GuildMember, TextChannel, AuditLogEvent} from "discord.js";
import {primaryEmbed} from "../utils/embeds";

export default class GuildMemberRemoveEvent extends Event {
    constructor() { super('guildMemberRemove', 'guildMemberRemove'); };

    async exec(member: GuildMember) {
        const welcome : TextChannel = member.guild.channels.cache.get(Bun.env.WELCOME_ID) as TextChannel // id chanel
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