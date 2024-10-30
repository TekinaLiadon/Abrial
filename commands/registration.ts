import SlashCommand from "../structures/Command";
import {Client, CommandInteraction, SlashCommandBuilder} from "discord.js";
import {errorEmbed, primaryEmbed} from "../utils/embeds";
import pg from 'pg'
const { Pool } = pg


export default class ExampleCommand extends SlashCommand {
    constructor() {
        super("registration", "Регистрация персонажа");
    }

    async exec(interaction: CommandInteraction) {
        const name = interaction.options.getString('name');
        const password = interaction.options.getString('password');
        const pool = new Pool()
        const checkUser = await pool.query('SELECT * FROM bot_character WHERE name = $1', [name])
        if(!checkUser.rows.length) {
            const guild = interaction.client.guilds.cache.get(Bun.env.GUILD_ID)
            const members = await guild.members.fetch();
            const member = members.find((el) =>
                el.user.username === interaction.user.username)
            const role = guild.roles.cache.get(Bun.env.CORE_ROLE);
            member.roles.add(role);
            const checkRegister = await pool.query('SELECT * FROM bot_core WHERE discord_id = $1', [member.id])
            if(!checkRegister.rows.length) {
                await pool.query('INSERT INTO bot_core (discord_id) VALUES ($1)', [member.id])
            }
            await pool.query('INSERT INTO bot_character (discord_id, name, password) VALUES ($1, $2, $3)', [member.id, name, password])
            interaction.reply({
                embeds: [
                    primaryEmbed('Регистрация завершена', `Персонаж по имени ${name} создан`)
                ]
            });
        } else interaction.reply({
            embeds: [
                errorEmbed('Oшибка', "Персонаж с таким именем уже существует")
            ]
        });

    }
    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand
            .addStringOption(string => string.setName('name').setDescription('Имя персонажа').setRequired(true))
            .addStringOption(string => string.setName('password').setDescription('Пароль для него').setRequired(true))
            .toJSON();
    }
}