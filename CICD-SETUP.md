# CI/CD Pipeline Setup Guide

## 🚀 Overview

This guide sets up a complete CI/CD pipeline that automatically builds, pushes, and deploys your Todo application whenever you push code to GitHub.

## 📋 Prerequisites

- GitHub repository with your code
- Docker Hub account
- AWS EC2 instances (created via Terraform)
- Puppet Master and Agents configured

## 🔧 GitHub Secrets Configuration

### 🚀 Automated Setup (Recommended)

Use the integrated deployment script to automatically set up all GitHub secrets:

```bash
./deploy-project.sh
# Choose option 8: Setup GitHub Secrets for CI/CD
```

This will:

- ✅ Check if GitHub CLI is installed and configured
- ✅ Automatically detect your AWS credentials
- ✅ Use your existing PEM file
- ✅ Set all required secrets in one go
- ✅ Provide step-by-step guidance

### 🎯 Dynamic IP Resolution

**No more hardcoded IPs!** The pipeline automatically fetches EC2 IPs from Terraform state, so you don't need to manually update IPs when infrastructure changes.

### 📝 Manual Setup (Alternative)

If you prefer to set secrets manually, add these to your GitHub repository (Settings → Secrets and variables → Actions):

```bash
# Docker Hub Credentials
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-access-token

# AWS Credentials (for accessing Terraform state)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1  # Optional, defaults to us-east-1

# EC2 SSH Key
EC2_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----  # Your PEM file content
```

### How to Get Docker Hub Token

1. Go to [Docker Hub](https://hub.docker.com/)
2. Login → Account Settings → Security
3. Click "New Access Token"
4. Name: `github-actions`
5. Permissions: `Read, Write, Delete`
6. Copy the generated token

### How to Get EC2 SSH Key

```bash
# Copy your PEM file content
cat project-mark-67.pem
# Copy the entire output including BEGIN/END lines
```

## 🏗️ Pipeline Architecture

### Workflow Files Created

```
.github/workflows/
├── frontend-cicd.yml      # Frontend-only deployment
├── backend-cicd.yml       # Backend-only deployment
└── full-stack-deploy.yml  # Complete application deployment
```

### Pipeline Flow

```mermaid
graph TD
    A[Code Push] --> B[GitHub Actions Triggered]
    B --> C[Build Docker Images]
    C --> D{Image Exists?}
    D -->|No| E[Build & Push to Docker Hub]
    D -->|Yes| F[Skip Build]
    E --> G[Deploy to EC2]
    F --> G
    G --> H[Health Check]
    H --> I[Deployment Complete]
```

## 🔄 Deployment Options

### 1. Automatic Deployment (Recommended)

- **Trigger**: Push to `main` branch
- **Action**: Automatically builds and deploys
- **Files**: Any changes in `ui/` or `demo/` folders

### 2. Manual Deployment

- **Trigger**: GitHub Actions → "Full Stack Deployment" → "Run workflow"
- **Options**: Choose to deploy frontend, backend, or both
- **Use Case**: Selective deployments

### 3. Puppet Auto-Deployment

- **Trigger**: Cron job every 5 minutes
- **Action**: Pulls latest images and restarts containers
- **Setup**: Run deployment option 6 in deploy script

## 📦 Docker Images

### Image Naming Convention

```bash
# Frontend
your-dockerhub-username/todo-frontend:latest
your-dockerhub-username/todo-frontend:abc12345  # Git SHA
your-dockerhub-username/todo-frontend:20241103-143022  # Timestamp

# Backend
your-dockerhub-username/todo-backend:latest
your-dockerhub-username/todo-backend:abc12345  # Git SHA
your-dockerhub-username/todo-backend:20241103-143022  # Timestamp
```

### Image Optimization

- ✅ Multi-stage builds for smaller images
- ✅ Layer caching for faster builds
- ✅ Automatic cleanup of old images
- ✅ Skip build if image already exists

## 🚀 Deployment Process

### Step 1: Initial Setup

```bash
# Run the deployment script
./deploy-project.sh
# Choose option 6: Deploy Todo App via Puppet
```

### Step 2: Verify Deployment

```bash
# Verify everything is working
./deploy-project.sh
# Choose option 7: Verify Deployment Status
```

This will check:

- ✅ Frontend accessibility
- ✅ Backend health and API
- ✅ Database connectivity
- ✅ Docker containers status
- ✅ Puppet Master status

### Step 3: Configure GitHub Secrets

```bash
# Automated setup (recommended)
./deploy-project.sh
# Choose option 8: Setup GitHub Secrets for CI/CD
```

Or manually add secrets via GitHub web interface (Settings → Secrets and variables → Actions)

### Step 4: Push Code

```bash
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main
```

### Step 5: Monitor Deployment

1. Go to GitHub → Actions tab
2. Watch the workflow execution
3. Check deployment logs

## 🔍 Monitoring & Troubleshooting

### Health Check URLs

```bash
# Frontend
curl http://YOUR_FRONTEND_IP:3000

# Backend
curl http://YOUR_BACKEND_IP:8080/actuator/health

# API Test
curl http://YOUR_BACKEND_IP:8080/api/todos
```

### Log Locations

```bash
# On EC2 instances
tail -f /var/log/frontend-deploy.log  # Frontend deployment logs
tail -f /var/log/backend-deploy.log   # Backend deployment logs

# Docker logs
docker logs todo-frontend
docker logs todo-backend
docker logs todo-mongodb
```

### Common Issues & Solutions

#### 1. Docker Hub Authentication Failed

```bash
# Solution: Check DOCKERHUB_USERNAME and DOCKERHUB_TOKEN secrets
# Regenerate Docker Hub token if needed
```

#### 2. SSH Connection Failed

```bash
# Solution: Verify EC2_SSH_KEY secret contains complete PEM file
# Check FRONTEND_EC2_IP and BACKEND_EC2_IP are correct
```

#### 3. Container Won't Start

```bash
# Check logs
ssh -i project-mark-67.pem ubuntu@EC2_IP
docker logs container-name

# Check docker-compose
cd /opt/todo-app/frontend  # or backend
docker compose logs
```

#### 4. Health Check Failed

```bash
# Wait longer for startup (especially backend with MongoDB)
# Check if MongoDB is running
docker ps | grep mongo

# Check application logs
docker logs todo-backend
```

## 🎯 Best Practices

### Code Organization

```
project/
├── ui/                    # Frontend code
│   ├── Dockerfile
│   └── ...
├── demo/                  # Backend code
│   ├── Dockerfile
│   └── ...
├── .github/workflows/     # CI/CD pipelines
└── terraform/             # Infrastructure
```

### Branch Strategy

- `main`: Production deployments
- `develop`: Development/staging
- Feature branches: No auto-deployment

### Security

- ✅ Use Docker Hub tokens, not passwords
- ✅ Rotate secrets regularly
- ✅ Limit EC2 security group access
- ✅ Use least-privilege IAM roles

## 📈 Performance Optimization

### Build Optimization

- Docker layer caching reduces build time by 60-80%
- Skip builds for unchanged code (SHA-based detection)
- Parallel frontend/backend builds
- Maven dependency caching

### Deployment Optimization

- Rolling deployments with health checks
- Automatic rollback on failure
- Image cleanup to save disk space
- Cron-based auto-deployment for continuous updates

## 🎉 Success Metrics

After successful setup, you should see:

- ✅ Automated builds on every push
- ✅ Zero-downtime deployments
- ✅ Health checks passing
- ✅ Applications accessible via public IPs
- ✅ Auto-deployment every 5 minutes via Puppet

## 🆘 Support

If you encounter issues:

1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Test SSH connectivity manually
4. Check EC2 instance status
5. Review Docker container logs

## 🔄 Next Steps

1. Set up monitoring (Prometheus/Grafana)
2. Add automated testing
3. Implement blue-green deployments
4. Add Slack/email notifications
5. Set up log aggregation (ELK stack)
