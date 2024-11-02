import SlashCommand from "../structures/Command";
import {Client, ChatInputCommandInteraction, SlashCommandBuilder,} from "discord.js";
import {errorEmbed, primaryEmbed} from "../utils/embeds";
import pg from 'pg'
const { Pool } = pg

export default class ExampleCommand extends SlashCommand {
    constructor() {
        super("add_points", "Добавить очки", {
            requiredPermissions: [
                'Administrator'
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction) {
        const pool = new Pool()
        const points = interaction.options.getNumber("points")
        const id = interaction.options.getString('id')
        const pointsSql = await pool.query('UPDATE bot_character SET points = points + $1 WHERE discord_id = $2', [points, id])


        await interaction.reply({
            embeds: [
                primaryEmbed('Готово', `Число очков пользователя изменено на ${points}`, "Gold")
            ]
        });
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand
            .addStringOption(string => string.setName('id').setDescription('Дискорд айди').setRequired(true))
            .addNumberOption((number) =>
                number.setName("points").setDescription("На сколько изменить").setRequired(true)
            )
            .toJSON();
    }
}