import { Events } from 'discord.js';
import { api } from '../lib/api.js';

export const name = Events.MessageCreate;

export async function execute(message) {
  if (!message.guild || message.author.bot) return;

  // V1: XP sederhana. Production sebaiknya pakai cooldown + anti-spam.
  try {
    await api.messageXp(message.guild.id, message.author.id);
  } catch (error) {
    console.error('XP error:', error.message);
  }
}
