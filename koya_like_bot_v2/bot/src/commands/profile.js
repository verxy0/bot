import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { api } from '../lib/api.js';

export const data = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('Lihat profile leveling dan economy.')
  .addUserOption(option =>
    option.setName('user').setDescription('User yang ingin dilihat').setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('user') ?? interaction.user;
  const p = await api.profile(interaction.guildId, user.id);

  const embed = new EmbedBuilder()
    .setTitle(`Profile — ${user.username}`)
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'Level', value: String(p.level), inline: true },
      { name: 'XP', value: String(p.xp), inline: true },
      { name: 'Coins', value: String(p.coins), inline: true }
    );

  await interaction.reply({ embeds: [embed] });
}
