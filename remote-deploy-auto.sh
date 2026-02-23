#!/bin/bash
set -e

# Configuration
VPS_USER="root"
VPS_IP="82.25.64.218"
VPS_PASS="-OI-hpFfAtQN-QJeL,6l"
REMOTE_DIR="/root/sunset-crm"

echo "⏳ Installing dependencies on remote server if needed..."
# Check if rsync exists on remote server
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $VPS_USER@$VPS_IP "which rsync || (apt-get update && apt-get install -y rsync)"

echo "🚀 Starting deployment to $VPS_IP..."

# Create directory
echo "📂 Creating remote directory..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $VPS_USER@$VPS_IP "mkdir -p $REMOTE_DIR"

# Copy files
echo "📤 Copying files..."
# Exclude node_modules, .next, .git
sshpass -p "$VPS_PASS" rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --exclude 'node_modules' --exclude '.next' --exclude '.git' ./ $VPS_USER@$VPS_IP:$REMOTE_DIR

# Deploy
echo "🐳 Building and starting containers..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $VPS_USER@$VPS_IP "cd $REMOTE_DIR && docker compose up -d --build"

# Wait for DB
echo "⏳ Waiting for database to be ready (15s)..."
sleep 15

# Run Migration
echo "🔄 Running migrations..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $VPS_USER@$VPS_IP "cd $REMOTE_DIR && docker compose exec -T app npx prisma@6 migrate deploy"

# Run Seed
echo "🌱 Seeding database..."
# We try to run the seed inside the container.
# If it fails due to missing tsx, we might need a workaround, but let's try standard way first.
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $VPS_USER@$VPS_IP "cd $REMOTE_DIR && docker compose exec -T app npx prisma@6 db seed"

echo "✅ Deployment finished! Access at https://crm.zionlab.cloud"
