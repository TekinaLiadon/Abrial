import SlashCommand from "../structures/Command";
import {Client, ChatInputCommandInteraction, SlashCommandBuilder,} from "discord.js";
import { primaryEmbed} from "../utils/embeds";
import db from "../structures/Db";
import {discordLogger} from "../utils/logger";

export default class ExampleCommand extends SlashCommand {
    constructor() {
        super("debugs", "Техническая команда", {
            requiredPermissions: [
                'Administrator'
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction) {
        //const test = await db.pool('SELECT * FROM bot_character', [], true)
        //const result = test.map((el) => JSON.stringify(el)).join(' | ')
        //discordLogger.error(result)
        // await db.pool('DELETE FROM bot_character WHERE discord_id = $1', ['997565297827528766']) Добавить удаление

        await interaction.reply({
            embeds: [
                primaryEmbed('Готово', `Дебагг про серверу проведен, данные в логах`, "Gold")
            ], ephemeral: true
        });
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand.toJSON();
    }
}