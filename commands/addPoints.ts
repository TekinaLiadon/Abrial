import SlashCommand from "../structures/Command";
import {Client, ChatInputCommandInteraction, SlashCommandBuilder,} from "discord.js";
import { primaryEmbed} from "../utils/embeds";
import db from "../structures/Db";
import { discordLogger } from "../utils/logger";

export default class ExampleCommand extends SlashCommand {
    constructor() {
        super("add_points", "Добавить очки", {
            requiredPermissions: [
                'Administrator'
            ]
        })
    }
    async exec(interaction: ChatInputCommandInteraction) {
        const points = interaction.options.getNumber("points")
        const id = interaction.options.getString('id')
        await db.pool('UPDATE bot_character SET points = points + $1 WHERE discord_id = $2', [points, id])
        discordLogger.info(`${interaction.user.globalName} / ${interaction.user.id} поменял пользователю ${id} число очков на ${points}`)

        await interaction.reply({
            embeds: [
                primaryEmbed('Готово', `Число очков пользователя изменено на ${points}`, "Gold")
            ], ephemeral: true
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