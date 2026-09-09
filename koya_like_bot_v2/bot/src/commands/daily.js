import { SlashCommandBuilder } from 'discord.js';
import { api } from '../lib/api.js';

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Ambil hadiah daily.');

export async function execute(interaction) {
  const result = await api.daily(interaction.guildId, interaction.user.id);
  await interaction.reply(result.success
    ? `🎁 ${result.message} Total coins: **${result.coins}**`
    : `⏳ ${result.message}`);
}
