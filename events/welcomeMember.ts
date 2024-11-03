// import { GuildMember, TextChannel } from 'discord.js';
// import Event from "../structures/Event";
// import { primaryEmbed } from '../utils/embeds';

// export default class ReadyEvent extends Event {
//     constructor() { super('Welcome', 'guildMemberAdd'); };

//     async exec(member: GuildMember) {
//         const welcome : TextChannel = member.guild.channels.cache.get('1144523726260547584') as TextChannel // id chanel

//         if(welcome) welcome.send({
//             embeds: [
//                 primaryEmbed("Новый участник", `Добро пожаловать на сервер ${member.guild.name} <@${member.id}>!`)
//             ]
//         })

//     }
// }
import { GuildMember, TextChannel, AttachmentBuilder } from "discord.js";
import Event from "../structures/Event";
import { primaryEmbed } from "../utils/embeds";
import { Canvas, createCanvas, loadImage, Image } from "@napi-rs/canvas";
import { URL } from "node:url";
import { request } from "undici";
import pg from 'pg'
import db from "../structures/Db";
const { Pool } = pg

// Также чтобы срабатывал это событие необходимо на портале разработчиков в настройках бота включить опцию Server Members Intent.

const applyText = (canvas: any, text: string) => {
  const context = canvas.getContext("2d");
  let fontSize = 70;

  do {
    context.font = `${(fontSize -= 10)}px sans-serif`;
  } while (context.measureText(text).width > canvas.width - 300);
  return context.font;
};
export default class ReadyEvent extends Event {
  constructor() {
    super("Welcome", "guildMemberAdd");
  }

  async exec(member: GuildMember) {
    const channel_id = await db.pool('SELECT channel_id FROM channel WHERE guild_id = $1 AND type=$2', [member.guild.id, "welcome"])
    const checkRegister = await db.pool('SELECT * FROM bot_core WHERE discord_id = $1', [member.user.id])
    const welcome: TextChannel = member.guild.channels.cache.get(channel_id?.channel_id) as TextChannel;
    if(!checkRegister.length) {
      await db.pool('INSERT INTO bot_character (discord_id, name) VALUES ($1, $2, $3)', [member.user.id, member.user.globalName,])
      let role = member.guild.roles.cache.get(Bun.env.CORE_ROLE);
      let user = member.guild.members.cache.get(member.user.id);
      user.roles.add(role);
    }
    const canvas = createCanvas(700, 250);
    const context = canvas.getContext("2d");
    const background = await loadImage(
      new URL("../assets/wallpaper.jpg", import.meta.url)
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "28px sans-serif";
    context.fillStyle = "#ffffff";
    context.fillText(
      `${member?.displayName}`,
      canvas.width / 2.5,
      canvas.height / 3.5
    );

    context.font = applyText(canvas, `Добро пожаловать на сервер`);
    context.fillStyle = "#ffffff";
    context.fillText(
      `Добро пожаловать на сервер`,
      canvas.width / 2.5,
      canvas.height / 1.8
    );

    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    const { body } = await request(member.displayAvatarURL({ format: "jpg" }));
    const avatar = new Image();
    avatar.src = Buffer.from(await body.arrayBuffer());
    context.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "profile-image.png",
    });

    welcome.send({ files: [attachment] });
  }
}
