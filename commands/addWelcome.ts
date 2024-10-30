import SlashCommand from "../structures/Command";
import {Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionResolvable, GuildMember,} from "discord.js";
import { primaryEmbed } from "../utils/embeds";

export default class AddWelcome extends SlashCommand {
    constructor() {
        super("add_welcome", "Добавление канала для приветственных сообщений", {
            requiredPermissions: [
                'Administrator'
            ]
        });
    }

    async exec(interaction: ChatInputCommandInteraction) {
        const channelId = interaction.channelId
        const guildId = interaction.guildId
        console.log(channelId)
        // заносить в базу

        await interaction.reply({
            embeds: [
                primaryEmbed('Title', `Канал добавлен`, "Gold")
            ]
        });
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand
            .toJSON();
    }
}