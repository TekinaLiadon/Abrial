import SlashCommand from "../structures/Command";
import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { primaryEmbed, errorEmbed } from "../utils/embeds";
import pg from 'pg'
const { Pool } = pg

export default class DiceCommand extends SlashCommand {
    constructor() {
        super("passport", "Узнать информацию о себе");
    }

    async exec(interaction: CommandInteraction) {
        const pool = new Pool()
        const checkRegister = await pool.query('SELECT * FROM bot_core WHERE discord_id = $1', [interaction.user.id])
        if(!checkRegister.rows.length) {
            interaction.reply({
                embeds: [
                    errorEmbed(
                        "Ошибка",
                        "Вы не зарегестрированы"
                    ),
                ],
            });
            return
        }
        /*console.log(interaction.memberPermissions, interaction.user)*/
        interaction.reply({
            embeds: [
                primaryEmbed(
                    "Ваши данные",
                    `Ник: ${interaction.user.globalName} \n ${interaction.user.username}`
                ).setThumbnail("https://i.imgur.com/AfFp7pu.png"),
            ],
        });
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand
            .toJSON();
    }
}