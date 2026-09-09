import {EmbedBuilder} from "discord.js";
export const commands=[
 {name:"avatar",description:"Show avatar",options:[{name:"user",description:"User",type:6}]},
 {name:"userinfo",description:"Show user info",options:[{name:"user",description:"User",type:6}]},
 {name:"help",description:"Show command categories"}
];
export async function run(i){let u=i.options.getUser("user")||i.user;if(i.commandName==="avatar")return i.reply(u.displayAvatarURL({size:1024}));if(i.commandName==="userinfo"){let m=await i.guild.members.fetch(u.id);return i.reply({embeds:[new EmbedBuilder().setTitle(u.tag).setThumbnail(u.displayAvatarURL()).addFields({name:"Joined",value:m.joinedAt?.toISOString()||"unknown"},{name:"ID",value:u.id})]});}return i.reply("Categories: Moderation • Leveling • Economy • Fun • Utility • Tickets • Giveaways • Roles • Logging • AutoMod")}
