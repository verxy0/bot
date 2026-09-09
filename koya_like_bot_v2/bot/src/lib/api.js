import axios from "axios";
const api=axios.create({baseURL:process.env.BACKEND_URL||"http://127.0.0.1:8000",headers:{"X-Internal-Key":process.env.INTERNAL_API_KEY}});
export const getProfile=(g,u)=>api.get(`/api/profile/${g}/${u}`).then(r=>r.data);
export const addXP=(g,u,a)=>api.post("/api/xp",{guild_id:g,user_id:u,amount:a}).then(r=>r.data);
export const daily=(g,u)=>api.post("/api/daily",{guild_id:g,user_id:u}).then(r=>r.data);
export const leaderboard=(g)=>api.get(`/api/leaderboard/${g}`).then(r=>r.data);
export const warn=(g,u,m,reason)=>api.post("/api/warn",{guild_id:g,user_id:u,moderator_id:m,reason}).then(r=>r.data);
export const warnings=(g,u)=>api.get(`/api/warnings/${g}/${u}`).then(r=>r.data);
export const setWelcome=(g,c,m)=>api.post("/api/welcome",{guild_id:g,channel_id:c,message:m}).then(r=>r.data);
