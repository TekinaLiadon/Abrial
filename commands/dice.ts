import SlashCommand from "../structures/Command";
import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { primaryEmbed, errorEmbed } from "../utils/embeds";

export default class DiceCommand extends SlashCommand {
  constructor() {
    super("dice", "Обычный бросок кубов");
  }

  async exec(interaction: CommandInteraction) {
    const dices = interaction.options.getNumber("dices");
    const facets = interaction.options.getNumber("facets");
    const mod = interaction.options.getNumber("mod");
    if (dices > 1000 || facets > 1000 || mod > 10000) {
      interaction.reply({
        embeds: [
          errorEmbed(
            "Не поддерживаемые значения",
            "Один из переданных аргументов больше лимита"
          ),
        ],
      });
      return;
    }
    let result = [];
    for (let i = 0; i < dices; i++) {
      result.push(Math.round(Math.random() * (facets - 1) + 1));
    }
    let str = `${dices}d${facets}`;
    if (mod) str += `+${mod}`;
    interaction.reply({
      embeds: [
        primaryEmbed(
          "Результат броска",
          `Бросок: ${str} \n ${
            result.reduce((partial_sum, a) => partial_sum + a, 0) + mod || 0
          }  ⟵ [${result.join(", ")}]`
        ).setThumbnail("https://i.imgur.com/AfFp7pu.png"),
      ],
    });
  }

  build(client: Client<boolean>, defaultCommand: SlashCommandBuilder) {
    return defaultCommand
      .addNumberOption((number) =>
        number.setName("dices").setDescription("Число кубов").setRequired(true)
      )
      .addNumberOption((number) =>
        number
          .setName("facets")
          .setDescription("Число граней")
          .setRequired(true)
      )
      .addNumberOption((number) =>
        number.setName("mod").setDescription("+ к кубам")
      )
      .toJSON();
  }
}
