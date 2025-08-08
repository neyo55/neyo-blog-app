#!/bin/bash

LOGFILE="/var/log/backend-install.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOGFILE"
}

set -e

log "Updating system packages..."
apt-get update -y >> "$LOGFILE" 2>&1
apt-get upgrade -y >> "$LOGFILE" 2>&1

log "Installing required packages..."
apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg >> "$LOGFILE" 2>&1

log "Installing Docker..."
curl -fsSL https://get.docker.com | bash >> "$LOGFILE" 2>&1
usermod -aG docker ubuntu

log "Installing Docker Compose..."
DOCKER_COMPOSE_VERSION=1.29.2
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose >> "$LOGFILE" 2>&1
chmod +x /usr/local/bin/docker-compose

log "Docker and Docker Compose installed successfully."

log "Deployment ready. Please reboot and ensure systemd service is enabled."
