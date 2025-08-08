#!/bin/bash

LOG_FILE="/var/log/user-data-db.log"
exec > >(tee -a "$LOG_FILE") 2>&1
exec 2> >(tee -a "$LOG_FILE" >&2)
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

echo "=== Starting DB-tier setup ==="
echo "Timestamp: $(date)"

echo "=== Updating apt index ==="
apt-get update -y
apt-get upgrade -y
apt-get install -y curl gnupg ca-certificates apt-transport-https lsb-release software-properties-common unzip

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | bash
    usermod -aG docker ubuntu
else
    echo "Docker is already installed."
fi

# Install Docker Compose if not already installed
if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose v2..."
    DOCKER_COMPOSE_VERSION="2.27.0"
    curl -SL "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
else
    echo "Docker Compose is already installed."
fi


echo "=== Cleaning old MongoDB key if exists ==="
rm -f /usr/share/keyrings/mongodb-server-7.0.gpg

echo "=== Importing MongoDB GPG key (non-interactive) ==="
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
  gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

echo "=== Adding MongoDB APT repository ==="
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" \
  | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

echo "=== Updating package list ==="
apt-get update -y

echo "=== Installing MongoDB (non-interactive) ==="
apt-get install -y mongodb-org

echo "=== Enabling and starting mongod ==="
systemctl enable mongod
systemctl start mongod

echo "=== Checking mongod status ==="
systemctl status mongod --no-pager

echo "=== MongoDB installed and running ==="
mongod --version

echo "=== DB-tier user-data script completed successfully at $(date) ==="
