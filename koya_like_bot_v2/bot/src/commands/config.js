import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { api } from '../lib/api.js';

export const data = new SlashCommandBuilder()
  .setName('config')
  .setDescription('Konfigurasi server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand(sub =>
    sub.setName('welcome')
      .setDescription('Atur channel dan pesan welcome.')
      .addChannelOption(o => o.setName('channel').setDescription('Channel welcome').setRequired(true))
      .addStringOption(o => o.setName('message').setDescription('Gunakan {user} dan {server}').setRequired(false))
  );

export async function execute(interaction) {
  const sub = interaction.options.getSubcommand();

  if (sub === 'welcome') {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message') ?? 'Welcome {user} to {server}!';

    await api.setWelcome(interaction.guildId, channel.id, message);
    await interaction.reply(`✅ Welcome channel diset ke ${channel}.\nPesan: ${message}`);
  }
}
