import Event from "../structures/Event";
import {
  GuildMember,
  MessageReaction,
  ChannelType,
  PermissionFlagsBits, TextChannel,
} from "discord.js";
import {starEmbed} from "../utils/embeds";

export default class MessageReactionAddEvent extends Event {
  constructor() {
    super("messageReactionAdd", "messageReactionAdd");
  }

  async exec(reaction: MessageReaction, member: GuildMember) {
    return
    // TODO Переделать
    const id = reaction.message.channelId;
    const emoji = reaction.emoji.name;
    const memberId = member.id;

    const reactions = reaction.message.reactions.cache.get(emoji).count;
    /*console.log(reactions, reaction.count)*/
    if (reaction.emoji.name === "⭐") {
      var count = 0
      reaction.users.reaction.client.users.cache.forEach((el) => {
        if(el?.username) count += 1
      })
      const guild = reaction.client.guilds.cache.get(Bun.env.GUILD_ID)
      const text = await reaction.message.fetch(reaction.message.id)
      await (guild.channels.cache.get(Bun.env.STAR_ID) as TextChannel ).send({
        embeds: [
          starEmbed('', text.content,
              text.author.username,
              text.author.displayAvatarURL(),
              reaction.message.url,"Gold")
        ]
      })

      /*const parentGuild = await client.guilds.fetch("514642467832856606");
      const newChannel = await parentGuild.channels.create({
        name: "hello",
        type: ChannelType.GuildText,
        parent: "1160644314246959256",
        permissionOverwrites: [
          {
            type: 1,
            id: memberId,
            allow: [PermissionFlagsBits.ViewChannel],
          },
          {
            type: 1,
            id: "872055735536738335", // id бота
            allow: [PermissionFlagsBits.ViewChannel],
          },
          {
            type: 0,
            id: "514647824319905802", // id роли гмов
            allow: [PermissionFlagsBits.ViewChannel],
          },
          {
            type: 0, // роль
            id: "514642467832856606", // id роли эвриван
            deny: [PermissionFlagsBits.ViewChannel],
          },
        ],
      });*/
    }
  }
}
