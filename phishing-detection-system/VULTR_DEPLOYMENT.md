# PhishGUARD Vultr Deployment Guide

This guide will help you deploy PhishGUARD to Vultr using Docker and Docker Compose.

## Prerequisites

- Vultr account
- Domain name (optional, but recommended)
- SSH client
- Git installed locally

## Step 1: Create a Vultr VPS Instance

1. Log in to your Vultr account: https://my.vultr.com/
2. Click "Deploy +" and select "Deploy New Server"
3. **Server Type**: Cloud Compute - Shared CPU
4. **Server Location**: Choose closest to your users
5. **Server Image**: Ubuntu 22.04 LTS
6. **Server Size**: Minimum 2 GB RAM / 1 CPU ($12/month)
   - For better performance: 4 GB RAM / 2 CPU ($24/month)
7. **Additional Features**:
   - Enable IPv6 (optional)
   - Enable Auto Backups (recommended)
8. **Server Hostname**: phishguard-server
9. Click "Deploy Now"

Wait for the server to be deployed (usually 1-2 minutes).

## Step 2: Initial Server Setup

### SSH into your server:
```bash
ssh root@YOUR_SERVER_IP
```

### Update system packages:
```bash
apt update && apt upgrade -y
```

### Install Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### Install Docker Compose:
```bash
apt install docker-compose -y
```

### Install Git:
```bash
apt install git -y
```

### Create a deployment directory:
```bash
mkdir -p /opt/phishguard
cd /opt/phishguard
```

## Step 3: Deploy Your Application

### Option A: Using Git (Recommended)

1. **Clone your repository:**
```bash
git clone https://github.com/YOUR_USERNAME/PhishGUARD.git .
cd phishing-detection-system
```

2. **Create environment file:**
```bash
cp .env.example .env
nano .env
```

3. **Update the .env file with your values:**
```env
SUPABASE_URL=https://jzzhqrzbnjjsjbalpvgl.supabase.co
SUPABASE_KEY=your_supabase_key_here
JWT_SECRET=aaacf8eebaa5a302ef5bd151d8a96267ce12b2b06f4f8680b6a9f7b488e3f253
VITE_API_URL=http://YOUR_SERVER_IP:5000/api
```

Save and exit (Ctrl+X, then Y, then Enter).

### Option B: Upload Files Manually

1. **From your local machine, upload the project:**
```bash
scp -r phishing-detection-system root@YOUR_SERVER_IP:/opt/phishguard/
```

2. **SSH into server and create .env file:**
```bash
ssh root@YOUR_SERVER_IP
cd /opt/phishguard/phishing-detection-system
cp .env.example .env
nano .env
```
Update the values as shown in Option A.

## Step 4: Build and Start Services

```bash
# Build the Docker images
docker-compose build

# Start the services
docker-compose up -d
```

### Verify services are running:
```bash
docker-compose ps
```

You should see 3 services running:
- phishguard-frontend
- phishguard-backend
- phishguard-ml

### Check logs if needed:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f ml-service
docker-compose logs -f frontend
```

## Step 5: Configure Firewall

```bash
# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS (for SSL later)
ufw allow 443/tcp

# Allow SSH
ufw allow 22/tcp

# Enable firewall
ufw enable
```

## Step 6: Test Your Deployment

1. **Open your browser and navigate to:**
   ```
   http://YOUR_SERVER_IP
   ```

2. **Test the backend API:**
   ```
   http://YOUR_SERVER_IP:5000
   ```

3. **Test the ML service:**
   ```
   http://YOUR_SERVER_IP:8000
   ```

## Step 7: Setup Domain and SSL (Optional but Recommended)

### Point your domain to your server:
1. Go to your domain registrar (e.g., Namecheap, GoDaddy)
2. Add an A record pointing to your Vultr server IP
3. Add a CNAME for api subdomain (optional):
   - Name: `api`
   - Value: `@` or your main domain

### Install and configure Nginx with SSL:

```bash
# Install Nginx
apt install nginx -y

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y

# Create Nginx configuration
nano /etc/nginx/sites-available/phishguard
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/phishguard /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Update your .env file with HTTPS URLs:
```bash
nano /opt/phishguard/phishing-detection-system/.env
```

Change:
```env
VITE_API_URL=https://yourdomain.com/api
```

Rebuild the frontend:
```bash
cd /opt/phishguard/phishing-detection-system
docker-compose up -d --build frontend
```

## Step 8: Setup Auto-restart on Server Reboot

```bash
# Create systemd service
nano /etc/systemd/system/phishguard.service
```

Paste:
```ini
[Unit]
Description=PhishGUARD Docker Compose Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/phishguard/phishing-detection-system
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable the service:
```bash
systemctl enable phishguard
systemctl start phishguard
```

## Useful Commands

### Restart all services:
```bash
docker-compose restart
```

### Stop all services:
```bash
docker-compose down
```

### Update your application:
```bash
git pull
docker-compose up -d --build
```

### View logs:
```bash
docker-compose logs -f
```

### Clean up old Docker images:
```bash
docker system prune -a
```

## Monitoring and Maintenance

### Check disk space:
```bash
df -h
```

### Check memory usage:
```bash
free -h
```

### Monitor Docker containers:
```bash
docker stats
```

### Backup your database:
Since you're using Supabase, your data is already backed up by Supabase.

## Troubleshooting

### If a service won't start:
```bash
docker-compose logs SERVICE_NAME
```

### If you need to rebuild everything:
```bash
docker-compose down
docker system prune -a
docker-compose up -d --build
```

### If port is already in use:
```bash
# Find what's using the port
lsof -i :PORT_NUMBER

# Kill the process
kill -9 PID
```

## Cost Estimation

**Vultr VPS (2GB RAM)**: ~$12/month
**Domain (optional)**: ~$10-15/year
**Supabase**: Free tier (sufficient for most use cases)

**Total**: ~$12-13/month

## Security Recommendations

1. **Change default SSH port**
2. **Setup SSH key authentication** and disable password login
3. **Keep system updated**: `apt update && apt upgrade -y`
4. **Enable automatic security updates**
5. **Setup monitoring** (optional: install monitoring tools like Netdata)
6. **Regular backups** (Vultr automatic backups recommended)

## Next Steps

1. Monitor your application for the first few days
2. Setup monitoring and alerts
3. Consider setting up a CI/CD pipeline for easier deployments
4. Implement rate limiting and additional security measures as needed

---

**Congratulations!** Your PhishGUARD application is now deployed on Vultr! 🎉
