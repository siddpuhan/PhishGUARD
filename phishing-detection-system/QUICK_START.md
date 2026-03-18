# Quick Start Guide - Vultr Deployment

## Prerequisites
- Vultr VPS (2GB RAM minimum)
- Ubuntu 22.04 LTS
- Your Supabase credentials

## Fast Deployment (15 minutes)

### 1. Create Vultr VPS
- Go to https://my.vultr.com/
- Deploy new server: Ubuntu 22.04, 2GB RAM
- Note your server IP

### 2. Connect and Setup
```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Run the setup script (one command does everything!)
curl -sSL https://raw.githubusercontent.com/YOUR_USERNAME/PhishGUARD/main/setup-vultr.sh | bash
```

### 3. Configure Environment
```bash
cd /opt/phishguard/phishing-detection-system
nano .env
```

Update these values:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
VITE_API_URL=http://YOUR_SERVER_IP:5000/api
```

### 4. Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

### 5. Access Your App
Open browser: `http://YOUR_SERVER_IP`

## That's it! 🎉

For detailed instructions, see [VULTR_DEPLOYMENT.md](VULTR_DEPLOYMENT.md)
