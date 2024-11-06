import Event from "../structures/Event";
import {GuildMember, TextChannel} from "discord.js";
import {primaryEmbed} from "../utils/embeds";

export default class GuildBanAddEvent extends Event {
    constructor() { super('guildBanAdd', 'guildBanAdd'); };

    async exec(member: GuildMember) {
        return
        // TODO переделать
        const welcome : TextChannel = member.guild.channels.cache.get('1144523726260547584') as TextChannel // id chanel
        const auditLogs = await member.guild.fetchAuditLogs( { type: 22 }); // enum AuditLogEvent
        const banLog = auditLogs.entries.first();
        if(welcome) welcome.send({
            embeds: [
                primaryEmbed(`Прощай`, `Пользователь <@${banLog?.targetId}> забанен пользователем ${banLog?.executor} по причине: "${banLog?.reason || 'Не указана'}"`)
            ]
        })
    }
}