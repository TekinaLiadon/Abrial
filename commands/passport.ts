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
import {formatDate} from "../utils/helpers";
import db from "../structures/Db";

export default class DiceCommand extends SlashCommand {
    constructor() {
        super("passport", "Узнать информацию о себе");
    }

    async exec(interaction: CommandInteraction) {
        const { points, createdAt } = await db.pool('SELECT * FROM bot_character WHERE discord_id = $1', [interaction.user.id])

        const user = interaction.user;
        const guild = interaction.guild;
        const member = await guild.members.fetch(user.id);
        const avatarURL = member.displayAvatarURL()
        const roleList = member.roles.cache.map(role => role.name).filter((el) => el !== "@everyone")
        const button = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Отметится')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(button);

        const response = await interaction.reply({
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
            components: [row],
            ephemeral: true
        });
        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId === 'confirm') {
                const now = new Date();
                const isoString = now.toISOString()
                const getTime = await pool.query('SELECT update_points FROM bot_character WHERE discord_id = $1', [interaction.user.id])
                const {update_points} = getTime.rows[0];
                const timeDifference = Math.abs(now - new Date(update_points))
                const hoursDifference = timeDifference / (1000 * 60 * 60)
                if(hoursDifference < 23) {
                    await confirmation.update({ content: 'Вы уже отмечались за последние 24 часа', embeds: [
                            primaryEmbed(
                                "Ваши данные",
                                `Статистика по серверу:`)
                                .addFields({name: "Ник", value: interaction.user.globalName, inline: false},
                                    { name: 'Количество очков', value: `${points}`, inline: false },
                                    { name: 'Список ролей', value: roleList.join(', '), inline: false },
                                    {name: 'Первое появление', value: `${formatDate(createdAt)}`})
                                .setThumbnail(avatarURL),
                        ], ephemeral: true  });
                    return
                }
                await db.pool('UPDATE bot_character SET points = points + 50, update_points = $1 WHERE discord_id = $2', [isoString, interaction.user.id])
                await confirmation.update({ content: 'Вы успешно отметились', embeds: [
                        primaryEmbed(
                            "Ваши данные",
                            `Статистика по серверу:`)
                            .addFields({name: "Ник", value: interaction.user.globalName, inline: false},
                                { name: 'Количество очков', value: `${points + 50}`, inline: false },
                                { name: 'Список ролей', value: roleList.join(', '), inline: false },
                                {name: 'Первое появление', value: `${formatDate(createdAt)}`})
                            .setThumbnail(avatarURL),
                    ], components: [], ephemeral: true  })
            }
        } catch (e) {
            await interaction.editReply({ content: 'Подтверждение не получено в течении 1 минуты. Отмена', components: [], ephemeral: true });
        }
    }

    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand
            .toJSON();
    }
}