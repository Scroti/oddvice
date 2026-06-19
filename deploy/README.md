# Deploying the Oddvice web (Ubuntu + Node + systemd + Caddy + Cloudflare)

Next.js (SSR + middleware) needs a Node runtime — we run `next start` behind
Caddy, with Cloudflare proxying `theworldcup.oddvice.app`.

## 0. Cloudflare (dashboard)
1. **DNS** → add `A  theworldcup → <VPS_IP>`, **Proxied** (orange cloud).
2. **SSL/TLS → Overview** → set mode to **Full (strict)**.
3. **SSL/TLS → Origin Server → Create Certificate** (hostname `theworldcup.oddvice.app`
   or `*.oddvice.app`). You'll paste the cert + key on the VPS in step 4.

## 1. Node (once)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x
```
> On a 1 GB VPS the build can OOM. If so, add swap:
> `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`

## 2. Clone + configure + build
```bash
id oddvice &>/dev/null || sudo useradd --system --home /opt/oddvice-web --shell /usr/sbin/nologin oddvice
sudo git clone https://github.com/Scroti/oddvice.git /opt/oddvice-web
cd /opt/oddvice-web
sudo cp .env.example .env.local
sudo nano .env.local        # NEXT_PUBLIC_API_URL=https://api.oddvice.app + Supabase keys
# Do NOT export NODE_ENV=production here — dev deps are needed to build.
sudo npm ci
sudo npm run build
sudo chown -R oddvice:oddvice /opt/oddvice-web
```

## 3. systemd service
```bash
sudo cp deploy/oddvice-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now oddvice-web
systemctl status oddvice-web
curl -s http://127.0.0.1:3000 | head -c 80   # HTML
```

## 4. Caddy (origin TLS for Cloudflare)
```bash
# Paste the Cloudflare Origin Certificate + key:
sudo nano /etc/caddy/origin.pem    # the certificate
sudo nano /etc/caddy/origin.key    # the private key
sudo chmod 600 /etc/caddy/origin.key

# Add the site block. If this VPS already runs the API's Caddy, append the
# block from deploy/Caddyfile to /etc/caddy/Caddyfile (keep api.oddvice.app).
sudo nano /etc/caddy/Caddyfile
sudo systemctl reload caddy
```
If Caddy isn't installed yet, see the API repo's `deploy/README.md` step 1.

## 5. Allow the web origin on the API (CORS)
On the **API** VPS, edit `/opt/oddvice-api/.env`:
```
CORS_ALLOWED_ORIGINS=https://theworldcup.oddvice.app,http://localhost:3000
```
```bash
sudo systemctl restart oddvice-api
```

## 6. Verify
Open `https://theworldcup.oddvice.app`. Check DevTools → Network: calls go to
`https://api.oddvice.app/...` and return data.

## Updating later
```bash
cd /opt/oddvice-web
sudo git pull
sudo npm ci
sudo npm run build
sudo chown -R oddvice:oddvice /opt/oddvice-web
sudo systemctl restart oddvice-web
```
