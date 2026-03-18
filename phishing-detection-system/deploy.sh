#!/bin/bash

# PhishGUARD Deployment Script for Vultr
# This script automates the deployment process

set -e

echo "================================================"
echo "PhishGUARD Deployment Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    echo "Please create a .env file from .env.example and configure your environment variables."
    exit 1
fi

print_status "Environment file found"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    echo "Please install Docker first: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    exit 1
fi

print_status "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed!"
    echo "Please install Docker Compose first: apt install docker-compose -y"
    exit 1
fi

print_status "Docker Compose is installed"

# Stop existing containers if running
print_status "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build the images
print_status "Building Docker images..."
docker-compose build

# Start the services
print_status "Starting services..."
docker-compose up -d

# Wait for services to be healthy
print_status "Waiting for services to start..."
sleep 10

# Check service status
print_status "Checking service status..."
docker-compose ps

# Show logs
echo ""
echo "================================================"
echo "Deployment Complete!"
echo "================================================"
echo ""
echo "Services are running at:"
echo "  Frontend: http://$(hostname -I | awk '{print $1}')"
echo "  Backend:  http://$(hostname -I | awk '{print $1}'):5000"
echo "  ML Service: http://$(hostname -I | awk '{print $1}'):8000"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
echo "================================================"

# Ask if user wants to see logs
read -p "Would you like to see the logs? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f
fi
