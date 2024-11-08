import { GuildMember, TextChannel} from "discord.js";
import Event from "../structures/Event";
import db from "../structures/Db";
import createImg from "../utils/createImg";

// Также чтобы срабатывал это событие необходимо на портале разработчиков в настройках бота включить опцию Server Members Intent.

let channel_id
let roleId
export default class ReadyEvent extends Event {
  constructor() {
    super("Welcome", "guildMemberAdd");
  }

  async exec(member: GuildMember) {
    if(!channel_id) {
      const sqlResult = await db.pool('SELECT channel_id FROM channel WHERE guild_id = $1 AND type=$2', [member.guild.id, "welcome"])
      channel_id = sqlResult.channel_id
    }
    const checkRegister = await db.pool('SELECT * FROM bot_character WHERE discord_id = $1 AND guild_id = $2', [member.user.id, member.guild.id])
    if(!checkRegister) await registration(member) // Проверить
    const welcome: TextChannel = member.guild.channels.cache.get(channel_id) as TextChannel;
    const attachment = await createImg(member)
    welcome.send({ files: [attachment] });
  }
}

var registration = async (res) => {
  await db.pool('INSERT INTO bot_character (discord_id, guild_id, name, password) VALUES ($1, $2, $3, $4)', [res.user.id, res.guild.id, res.user.globalName, 54321])
  if(!roleId) {
    res.guild.roles.cache.forEach(role => {
      if(role.name === 'Новичок') roleId = role.id
    });
  }
  if(roleId) {
    let role = res.guild.roles.cache.get(roleId);
    let user = res.guild.members.cache.get(res.user.id);
    user.roles.add(role);
  }
}
