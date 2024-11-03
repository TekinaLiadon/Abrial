import SlashCommand from "../structures/Command";
import {Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionResolvable, GuildMember,} from "discord.js";
import { primaryEmbed } from "../utils/embeds";

export default class ExampleCommand extends SlashCommand {
    constructor() {
        super("test", "Test description", { // в имени низя юзать большие буквы
            requiredPermissions: [
                'Administrator' // У роли список прав, вроде просмотра каналов и т.д
            ]
        });
    }

    async exec(interaction: ChatInputCommandInteraction) {
        const boolean = interaction.options.getBoolean('boolean');
        const string = interaction.options.getString('string');
        // interaction.channelId получить айди канала, где команда

        await interaction.reply({
            embeds: [
                primaryEmbed('Title', `boolean: ${boolean}\nstring: ${string}`, "Gold")
            ]
        });
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand
            .addBooleanOption(boolean => boolean.setName('boolean').setDescription('test boolean option').setRequired(true))
            .addStringOption(string => string.setName('string').setDescription('test string option').setRequired(true))
            .toJSON();
    }
}