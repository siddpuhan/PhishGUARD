#!/bin/bash

# Automated Vultr Server Setup Script
# This script installs all dependencies needed for PhishGUARD

set -e

echo "================================================"
echo "PhishGUARD Vultr Server Setup"
echo "================================================"
echo ""

# Update system
echo "[1/6] Updating system packages..."
apt update && apt upgrade -y

# Install Docker
echo "[2/6] Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
echo "[3/6] Installing Docker Compose..."
apt install docker-compose -y

# Install Git
echo "[4/6] Installing Git..."
apt install git curl nano -y

# Create deployment directory
echo "[5/6] Creating deployment directory..."
mkdir -p /opt/phishguard
cd /opt/phishguard

# Clone repository (update with your repo URL)
echo "[6/6] Ready for deployment..."
echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Upload your project files to /opt/phishguard/"
echo "2. Create and configure your .env file"
echo "3. Run ./deploy.sh to start the application"
echo ""
echo "For detailed instructions, see VULTR_DEPLOYMENT.md"
echo "================================================"
