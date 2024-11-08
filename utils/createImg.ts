import {Canvas, createCanvas, loadImage, Image} from "@napi-rs/canvas";
import {URL} from "node:url";
import {request} from "undici";
import {AttachmentBuilder, GuildMember} from "discord.js";
// /usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf

const applyText = (canvas: any, text: string) => {
    const context = canvas.getContext("2d");
    let fontSize = 70;
    do {
        context.font = `${(fontSize -= 10)}px DejaVuSansMono`;
    } while (context.measureText(text).width > canvas.width - 300);
    return context.font;
};

export default async (member: GuildMember) => {
    const canvas = createCanvas(700, 250);
    const context = canvas.getContext("2d");
    const background = await loadImage(
        new URL("../assets/wallpaper.jpg", import.meta.url)
    );
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "28px DejaVuSansMono";
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
    return attachment
}