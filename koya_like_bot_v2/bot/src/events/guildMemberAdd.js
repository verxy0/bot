import { Events } from 'discord.js';
import { api } from '../lib/api.js';

export const name = Events.GuildMemberAdd;

export async function execute(member) {
  try {
    const cfg = await api.welcome(member.guild.id);
    if (!cfg.channel_id) return;

    const channel = member.guild.channels.cache.get(cfg.channel_id);
    if (!channel?.isTextBased()) return;

    const content = cfg.message
      .replaceAll('{user}', `<@${member.id}>`)
      .replaceAll('{server}', member.guild.name);

    await channel.send(content);
  } catch (error) {
    console.error('Welcome error:', error.message);
  }
}
