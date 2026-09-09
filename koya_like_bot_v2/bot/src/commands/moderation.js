import {PermissionFlagsBits} from "discord.js";
import {warn,warnings} from "../lib/api.js";
export const commands=[
 {name:"kick",description:"Kick a member",options:[{name:"user",description:"Member",type:6,required:true},{name:"reason",description:"Reason",type:3}]},
 {name:"ban",description:"Ban a member",options:[{name:"user",description:"Member",type:6,required:true},{name:"reason",description:"Reason",type:3}]},
 {name:"timeout",description:"Timeout a member",options:[{name:"user",description:"Member",type:6,required:true},{name:"minutes",description:"Minutes",type:4,required:true},{name:"reason",description:"Reason",type:3}]},
 {name:"warn",description:"Warn a member",options:[{name:"user",description:"Member",type:6,required:true},{name:"reason",description:"Reason",type:3,required:true}]},
 {name:"warnings",description:"Show warnings",options:[{name:"user",description:"Member",type:6,required:true}]},
 {name:"purge",description:"Delete messages",options:[{name:"amount",description:"1-100",type:4,required:true}]},
 {name:"slowmode",description:"Set channel slowmode",options:[{name:"seconds",description:"0-21600",type:4,required:true}]}
];
export async function run(i){
 const cmd=i.commandName, u=i.options.getUser("user"), reason=i.options.getString("reason")||"No reason provided";
 if(cmd==="kick"){if(!i.member.permissions.has(PermissionFlagsBits.KickMembers))return i.reply({content:"Missing permission.",ephemeral:true});await i.guild.members.kick(u,reason);return i.reply(`Kicked ${u.tag}.`)}
 if(cmd==="ban"){if(!i.member.permissions.has(PermissionFlagsBits.BanMembers))return i.reply({content:"Missing permission.",ephemeral:true});await i.guild.members.ban(u,{reason});return i.reply(`Banned ${u.tag}.`)}
 if(cmd==="timeout"){if(!i.member.permissions.has(PermissionFlagsBits.ModerateMembers))return i.reply({content:"Missing permission.",ephemeral:true});let m=i.options.getInteger("minutes");let mem=await i.guild.members.fetch(u.id);await mem.timeout(Math.min(m,40320)*60000,reason);return i.reply(`Timed out ${u.tag} for ${m} minutes.`)}
 if(cmd==="warn"){if(!i.member.permissions.has(PermissionFlagsBits.ModerateMembers))return i.reply({content:"Missing permission.",ephemeral:true});await warn(i.guild.id,u.id,i.user.id,reason);return i.reply(`Warned ${u.tag}: ${reason}`)}
 if(cmd==="warnings"){let rows=await warnings(i.guild.id,u.id);return i.reply(rows.length?rows.map((x,n)=>`${n+1}. ${x.reason}`).join("\n"):"No warnings.")}
 if(cmd==="purge"){if(!i.member.permissions.has(PermissionFlagsBits.ManageMessages))return i.reply({content:"Missing permission.",ephemeral:true});let n=i.options.getInteger("amount");let msgs=await i.channel.bulkDelete(Math.min(n,100),true);return i.reply({content:`Deleted ${msgs.size} messages.`,ephemeral:true})}
 if(cmd==="slowmode"){if(!i.member.permissions.has(PermissionFlagsBits.ManageChannels))return i.reply({content:"Missing permission.",ephemeral:true});let s=i.options.getInteger("seconds");await i.channel.setRateLimitPerUser(Math.min(s,21600));return i.reply(`Slowmode set to ${s}s.`)}
}
