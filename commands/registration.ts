import SlashCommand from "../structures/Command";
import {Client, ChatInputCommandInteraction, SlashCommandBuilder,} from "discord.js";
import { primaryEmbed} from "../utils/embeds";
import db from "../structures/Db";

let roleId
export default class ExampleCommand extends SlashCommand {
    constructor() {
        super("registration", "Регистрация")
    }
    async exec(interaction: ChatInputCommandInteraction) {
        const checkRegister = await db.pool('SELECT * FROM bot_character WHERE discord_id = $1 AND guild_id = $2', [interaction.user.id, interaction.guild.id])
        if(!checkRegister) await registration(interaction)

        await interaction.reply({
            embeds: [
                primaryEmbed('Готово', `Вы зарегистрированны`, "Gold")
            ], ephemeral: true
        });
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand.toJSON();
    }
}

const registration = async (res) => {
    await db.pool('INSERT INTO bot_character (discord_id, guild_id, name, password) VALUES ($1, $2, $3, $4)', [res.user.id, res.guild.id, res.user.globalName, 54321])
    if(!roleId) res.guild.roles.cache.forEach(role => {
        if(role.name === 'Новичок') roleId = role.id
    });
    if(roleId) {
        let role = res.guild.roles.cache.get(roleId);
        let user = res.guild.members.cache.get(res.user.id);
        user.roles.add(role);
    }
}