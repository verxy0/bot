import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Cek apakah bot online.');

export async function execute(interaction) {
  await interaction.reply(`🏓 Pong! ${interaction.client.ws.ping}ms`);
}
