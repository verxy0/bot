import "dotenv/config";
import {Client,GatewayIntentBits,REST,Routes,PermissionFlagsBits} from "discord.js";
import {addXP,getProfile,daily,leaderboard,setWelcome} from "./lib/api.js";
import {commands as mod,run as modRun} from "./commands/moderation.js";
import {commands as eco,run as ecoRun} from "./commands/economy.js";
import {commands as fun,run as funRun} from "./commands/fun.js";
import {commands as util,run as utilRun} from "./commands/utility.js";
const client=new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMembers]});
const base=[
{name:"ping",description:"Pong"},
{name:"profile",description:"Profile",options:[{name:"user",description:"User",type:6}]},
{name:"rank",description:"Rank"},
{name:"daily",description:"Daily reward"},
{name:"leaderboard",description:"Leaderboard"},
{name:"config-welcome",description:"Configure welcome",options:[{name:"channel",description:"Channel",type:7,required:true},{name:"message",description:"Message",type:3}]}
];
const all=[...base,...mod,...eco,...fun,...util];
client.once("ready",async()=>{const rest=new REST({version:"10"}).setToken(process.env.DISCORD_TOKEN);const route=process.env.DISCORD_GUILD_ID?Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID,process.env.DISCORD_GUILD_ID):Routes.applicationCommands(process.env.DISCORD_CLIENT_ID);await rest.put(route,{body:all});console.log(`Logged in as ${client.user.tag}`)});
client.on("interactionCreate",async i=>{if(!i.isChatInputCommand())return;try{
 if(["kick","ban","timeout","warn","warnings","purge","slowmode"].includes(i.commandName))return modRun(i);
 if(["balance","work","pay"].includes(i.commandName))return ecoRun(i);
 if(["8ball","choose","ship"].includes(i.commandName))return funRun(i);
 if(["avatar","userinfo","help"].includes(i.commandName))return utilRun(i);
 if(i.commandName==="ping")return i.reply("Pong!");
 if(i.commandName==="profile"){let p=await getProfile(i.guild.id,(i.options.getUser("user")||i.user).id);return i.reply(`Level ${p.level} • XP ${p.xp} • Coins ${p.coins}`)}
 if(i.commandName==="rank"){let p=await getProfile(i.guild.id,i.user.id);return i.reply(`🏆 Level ${p.level} • XP ${p.xp}`)}
 if(i.commandName==="daily"){let r=await daily(i.guild.id,i.user.id);return i.reply(r.claimed?`🎁 +500 coins. Balance: ${r.coins}`:`Already claimed. Next: ${r.next}`)}
 if(i.commandName==="leaderboard"){let rows=await leaderboard(i.guild.id);return i.reply(rows.map((x,n)=>`#${n+1} <@${x.user_id}> — Lv ${x.level} • ${x.xp} XP • ${x.coins} coins`).join("\n")||"No data.")}
 if(i.commandName==="config-welcome"){if(!i.member.permissions.has(PermissionFlagsBits.ManageGuild))return i.reply({content:"Missing permission.",ephemeral:true});await setWelcome(i.guild.id,i.options.getChannel("channel").id,i.options.getString("message"));return i.reply("Welcome configured.")}
}catch(e){console.error(e);if(!i.replied)await i.reply({content:"An error occurred.",ephemeral:true})}});
client.on("messageCreate",async m=>{if(m.author.bot||!m.guild)return;try{await addXP(m.guild.id,m.author.id,10)}catch(e){console.error(e)}});
client.on("guildMemberAdd",async m=>{console.log(`Member joined ${m.guild.id}: ${m.user.tag}`)});
client.login(process.env.DISCORD_TOKEN);
