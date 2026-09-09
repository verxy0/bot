import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Menampilkan informasi server.');

export async function execute(interaction) {
  const guild = interaction.guild;
  await interaction.reply({
    embeds: [{
      title: guild.name,
      thumbnail: { url: guild.iconURL({ size: 256 }) ?? undefined },
      fields: [
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: String(guild.memberCount), inline: true },
        { name: 'Channels', value: String(guild.channels.cache.size), inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
      ]
    }]
  });
}
