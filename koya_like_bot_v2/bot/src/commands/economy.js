import {getProfile} from "../lib/api.js";
export const commands=[
 {name:"balance",description:"Show balance",options:[{name:"user",description:"User",type:6}]},
 {name:"work",description:"Earn coins"},
 {name:"pay",description:"Pay a user",options:[{name:"user",description:"User",type:6,required:true},{name:"amount",description:"Amount",type:4,required:true}]}
];
const mem=new Map();
export async function run(i){const p=await getProfile(i.guild.id,(i.options.getUser("user")||i.user).id); if(i.commandName==="balance")return i.reply(`💰 ${p.coins} coins | Level ${p.level}`);
 if(i.commandName==="work"){let k=`${i.guild.id}:${i.user.id}`,last=mem.get(k)||0;if(Date.now()-last<300000)return i.reply("Try again in a few minutes.");mem.set(k,Date.now());return i.reply("You worked and earned 100 coins. (Persistence for work rewards is planned for the economy worker.)")}
 if(i.commandName==="pay")return i.reply("Pay command is wired; persistent transfers require the economy transaction worker in the next migration.")}
