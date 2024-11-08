import SlashCommand from "../structures/Command";
import {Client, ChatInputCommandInteraction, SlashCommandBuilder,} from "discord.js";
import { primaryEmbed} from "../utils/embeds";
import { TextChannel } from 'discord.js';

export default class ExampleCommand extends SlashCommand {
    constructor() {
        super("post", "Сделать объявление")
    }

    async exec(interaction: ChatInputCommandInteraction) {
        return
        // TODO
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const guild = interaction.client.guilds.cache.get(Bun.env.GUILD_ID)

        await (guild.channels.cache.get(Bun.env.NEWS_ID) as TextChannel ).send({
            embeds: [
                primaryEmbed(name, description, "Gold").setThumbnail("https://i.imgur.com/AfFp7pu.png")
            ]
        })

        await interaction.reply({
            embeds: [
                primaryEmbed('Готово', `Пост опубликован`, "Gold")
            ], ephemeral: true
        });
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand
            .addStringOption(string => string.setName('name').setDescription('Кто публикует').setRequired(true))
            .addStringOption(string => string.setName('description').setDescription('Описание').setRequired(true))
            .toJSON();
    }
}