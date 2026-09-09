export const commands=[
 {name:"8ball",description:"Ask the magic 8-ball",options:[{name:"question",description:"Question",type:3,required:true}]},
 {name:"choose",description:"Choose one",options:[{name:"options",description:"a | b | c",type:3,required:true}]},
 {name:"ship",description:"Compatibility score",options:[{name:"user1",description:"User",type:6,required:true},{name:"user2",description:"User",type:6,required:true}]}
];
export async function run(i){if(i.commandName==="8ball")return i.reply(["Yes.","No.","Maybe.","Absolutely.","Ask later."][Math.floor(Math.random()*5)]);if(i.commandName==="choose"){let a=i.options.getString("options").split("|").map(x=>x.trim()).filter(Boolean);return i.reply(a[Math.floor(Math.random()*a.length)]||"No options.");}if(i.commandName==="ship")return i.reply(`💖 Compatibility: ${Math.floor(Math.random()*101)}%`)}
