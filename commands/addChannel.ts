import SlashCommand from "../structures/Command";
import {Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionResolvable, GuildMember,} from "discord.js";
import { primaryEmbed } from "../utils/embeds";
import db from "../structures/Db";

export default class AddChannel extends SlashCommand {
    constructor() {
        super("add_channel", "Добавление канала для приветственных сообщений", {
            requiredPermissions: [
                'Administrator'
            ]
        });
    }

    async exec(interaction: ChatInputCommandInteraction) {
        if(!interaction?.guild?.id) {
            interaction.reply({ embeds: [
                    primaryEmbed(
                        "Ошибка",
                        'Команду можно применять только на сервере')
                ], ephemeral: true });
            return
        }
        const channelId = interaction.channelId
        const guildId = interaction.guildId
        const type = interaction.options.getString('type')
        await db.pool('INSERT INTO channel (guild_id, channel_id, type) VALUES ($1, $2, $3)', [guildId, channelId, type])
        await interaction.reply({
            embeds: [
                primaryEmbed('Title', `Канал добавлен`, "Gold")
            ], ephemeral: true
        });
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand.addStringOption(string => string.setName('type').setDescription('Тип канала').setRequired(true))
            .toJSON();
    }
}