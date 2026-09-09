import { SlashCommandBuilder } from 'discord.js';
import { api } from '../lib/api.js';

export const data = new SlashCommandBuilder()
  .setName('rank')
  .setDescription('Lihat rank kamu.');

export async function execute(interaction) {
  const p = await api.profile(interaction.guildId, interaction.user.id);
  await interaction.reply(
    `🏆 **${interaction.user.username}** — Level **${p.level}**, XP **${p.xp}**, Coins **${p.coins}**`
  );
}
