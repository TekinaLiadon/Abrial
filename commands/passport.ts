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
        if(!interaction?.guild?.id) {
            interaction.reply({ embeds: [
                    primaryEmbed(
                        "Ошибка",
                        'Команду можно применять только на сервере')
                ], ephemeral: true });
            return
        }
        const { points, createdAt } = await db.pool('SELECT * FROM bot_character WHERE discord_id = $1 AND guild_id = $2', [interaction.user.id, interaction.guild.id])

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
        btnFunc(interaction, response, {
            points,
            roleList,
            createdAt,
            avatarURL,
        })
    }
    build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
        return defaultCommand
            .toJSON();
    }
}

var btnFunc = async (interaction, response, options: Object) => {
    try {
        const collectorFilter = i => i.user.id === interaction.user.id;
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'confirm') {
            const now = new Date();
            const isoString = now.toISOString()
            const {update_points} = await db.pool('SELECT update_points FROM bot_character WHERE discord_id = $1 AND guild_id = $2', [interaction.user.id, interaction.guild.id])
            const timeDifference = Math.abs(now - new Date(update_points))
            const hoursDifference = timeDifference / (1000 * 60 * 60)
            if(hoursDifference < 23) {
                await confirmation.update(constructorMessage(interaction, options, 'Вы уже отмечались за последние 24 часа'));
                return
            }
            await db.pool('UPDATE bot_character SET points = points + 50, update_points = $1 WHERE discord_id = $2 AND guild_id = $3', [isoString, interaction.user.id, interaction.guild.id])
            await confirmation.update(constructorMessage(interaction, {
                points: options.points + 50,
                roleList: options.roleList,
                createdAt: options.createdAt,
                avatarURL: options.avatarURL,
            }, 'Вы успешно отметились'))
        }
    } catch (e) {
        await interaction.editReply({ embeds: [
                primaryEmbed(
                    "Превышено время ожидания",
                    'Подтверждение об отметке не получено в течении 1 минуты. Отмена')
            ], components: [], ephemeral: true });
    }
}

var constructorMessage = (interaction, options: Object, title) => {
    return { content: title, embeds: [
        primaryEmbed(
            "Ваши данные",
            `Статистика по серверу:`)
            .addFields({name: "Ник", value: interaction.user.globalName, inline: false},
                { name: 'Количество очков', value: `${options.points}`, inline: false },
                { name: 'Список ролей', value: options.roleList.join(', '), inline: false },
                {name: 'Первое появление', value: `${formatDate(options.createdAt)}`})
            .setThumbnail(options.avatarURL),
    ], components: [], ephemeral: true  }
}