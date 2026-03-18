# Docker Deployment Files

This directory contains all the necessary files for deploying PhishGUARD to Vultr using Docker.

## Files Overview

### Docker Configuration
- `Dockerfile` (in each service directory) - Container build instructions
- `docker-compose.yml` - Orchestration configuration
- `.dockerignore` - Files to exclude from Docker builds
- `nginx.conf` - Frontend nginx configuration
- `nginx-reverse-proxy.conf` - Production reverse proxy configuration

### Deployment Scripts
- `deploy.sh` - Automated deployment script
- `setup-vultr.sh` - Server initialization script

### Documentation
- `VULTR_DEPLOYMENT.md` - Complete deployment guide
- `QUICK_START.md` - Quick deployment guide
- `README.md` - This file

### Environment
- `.env.example` - Environment variables template
- `.env` - Your actual environment variables (create this)

## Quick Deployment

1. **Local testing:**
   ```bash
   docker-compose up -d
   ```

2. **Deploy to Vultr:**
   See [VULTR_DEPLOYMENT.md](VULTR_DEPLOYMENT.md) for complete instructions

3. **Quick deploy:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Architecture

```
┌─────────────────┐
│   Nginx Proxy   │ (Port 80/443)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│Front │  │ Back │
│ end  │  │ end  │
│:80   │  │:5000 │
└──────┘  └───┬──┘
              │
         ┌────▼────┐
         │   ML    │
         │ Service │
         │  :8000  │
         └─────────┘
```

## Services

1. **Frontend** - React + Nginx (Port 80)
2. **Backend** - Node.js/Express (Port 5000)
3. **ML Service** - FastAPI/Python (Port 8000)

## Environment Variables

### Required for Backend:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon key
- `JWT_SECRET` - Secret for JWT token generation
- `ML_SERVICE_URL` - URL to ML service (in Docker: http://ml-service:8000)

### Required for Frontend:
- `VITE_API_URL` - Backend API URL

## Monitoring

Check service status:
```bash
docker-compose ps
docker-compose logs -f
```

Check resource usage:
```bash
docker stats
```

## Troubleshooting

### Service won't start:
```bash
docker-compose logs SERVICE_NAME
```

### Rebuild everything:
```bash
docker-compose down
docker-compose up -d --build
```

### Clear Docker cache:
```bash
docker system prune -a
```

## Support

For issues or questions, see the main documentation or open an issue on GitHub.
