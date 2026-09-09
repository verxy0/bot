# Web Dashboard

Buka `http://SERVER:8000/` setelah backend aktif.

## Fitur UI
- Server settings
- Welcome channel/message
- Level-up message
- AutoMod enable/disable
- Discord invite blocking flag
- Blocked-word list
- Logging channel
- Responsive dark dashboard
- Save/load settings

## Deployment
Untuk VPS, gunakan Nginx/Cloudflare Access/basic auth ouput di depan dashboard. Jangan expose internal API key ke browser.

Catatan: endpoint PUT settings menggunakan `X-Internal-Key`, sehingga browser langsung membutuhkan mekanisme auth/proxy. Untuk instalasi single-server cepat, letakkan dashboard di jaringan privat atau tambahkan reverse-proxy yang menyisipkan header internal key. OAuth2 Discord dapat ditambahkan pada fase production-hardening.
