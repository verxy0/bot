import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { api } from '../lib/api.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Lihat leaderboard XP.');

export async function execute(interaction) {
  const rows = await api.leaderboard(interaction.guildId, 10);
  const text = rows.length
    ? rows.map((r, i) => `**${i + 1}.** <@${r.user_id}> — Level ${r.level} • ${r.xp} XP`).join('\n')
    : 'Belum ada data.';

  await interaction.reply({
    embeds: [new EmbedBuilder().setTitle('🏆 XP Leaderboard').setDescription(text)]
  });
}
