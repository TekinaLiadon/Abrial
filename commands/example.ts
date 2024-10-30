import SlashCommand from "../structures/Command";
import { CommandInteraction } from "discord.js";
import { primaryEmbed } from "../utils/embeds";

export default class ExampleCommand extends SlashCommand {
    constructor() {
        super("example", "An example command.", { // в имени низя юзать большие буквы
            requiredPermissions: [
                'Administrator' // У роли список прав, вроде просмотра каналов и т.д
            ]
        });
    }

    exec(interaction: CommandInteraction) {
        interaction.reply({
            embeds: [
                primaryEmbed('', "Yay this works!")
            ]
        });
    }
}