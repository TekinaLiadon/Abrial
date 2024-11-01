import SlashCommand from "../structures/Command";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { primaryEmbed } from "../utils/embeds";
import pg from 'pg'
import {formatDate} from "../utils/helpers";
const { Pool } = pg

export default class DiceCommand extends SlashCommand {
    constructor() {
        super("passport", "Узнать информацию о себе");
    }

    async exec(interaction: CommandInteraction) {
        const pool = new Pool()
        const pointsSql = await pool.query('SELECT * FROM bot_character WHERE discord_id = $1', [interaction.user.id])
        const { points, createdAt } = pointsSql.rows[0];

        const user = interaction.user;
        const guild = interaction.guild;
        const member = await guild.members.fetch(user.id);
        const avatarURL = member.displayAvatarURL()
        const roleList = member.roles.cache.map(role => role.name).filter((el) => el !== "@everyone")
        const button = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Отметится')
            .setStyle(ButtonStyle.Success);
        const emptyRow = new ActionRowBuilder()

        const row = new ActionRowBuilder()
            .addComponents(button);

        interaction.reply({
            embeds: [
                primaryEmbed(
                    "Ваши данные",
                    `Статистика по серверу:`)
                    .addFields({name: "Ник", value: interaction.user.globalName, inline: false},
                        { name: 'Количество очков', value: `${points}`, inline: false },
                        { name: 'Список ролей', value: roleList.join(', '), inline: false },
                        {name: 'Первое появление', value: `${formatDate(createdAt)}`})
                    .setThumbnail(avatarURL),
            ],
            components: [emptyRow, row]
        });
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand
            .toJSON();
    }
}