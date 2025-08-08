#!/bin/bash

LOG_FILE="/var/log/database.log"
exec > >(tee -a "$LOG_FILE") 2>&1
exec 2> >(tee -a "$LOG_FILE" >&2)
set -euo pipefail

echo "======== Starting MongoDB setup at $(date) ========"

trap 'echo "[ERROR] Script failed at line $LINENO. Check $LOG_FILE for details."; exit 1' ERR

# Utility function to check if a command exists
is_installed() {
    command -v "$1" &> /dev/null
}

# Package installation helper
install_package() {
    if ! dpkg -s "$1" &>/dev/null; then
        echo "Installing $1..."
        apt-get install -y "$1"
    else
        echo "$1 is already installed."
    fi
}

apt-get update -y

# Install base tools
for pkg in git vim unzip wget curl gnupg lsb-release; do
    install_package "$pkg"
done

# Install Docker
install_package docker.io
systemctl enable docker
systemctl start docker

# Add ubuntu to docker group
if ! groups ubuntu | grep -q docker; then
    usermod -aG docker ubuntu
fi

# Install Docker Compose v2
if ! is_installed docker-compose; then
    DOCKER_COMPOSE_VERSION="2.24.0"
    curl -SL "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Import MongoDB public GPG key
echo "Importing MongoDB GPG key..."
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg

# Add MongoDB repository for Ubuntu Jammy (22.04)
echo "Adding MongoDB repository for Ubuntu Jammy..."
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list
echo "Updating package list after adding MongoDB repository..."
sudo apt update

# Install MongoDB Shell (mongosh)
if ! is_installed mongosh; then
    echo "Installing MongoDB Shell (mongosh)..."
    sudo apt install -y mongodb-mongosh
else
    echo "MongoDB Shell (mongosh) already installed."
fi

# Verify mongosh installation
if is_installed mongosh; then
    echo "MongoDB Shell version: $(mongosh --version)"
else
    echo "[ERROR] MongoDB Shell (mongosh) installation failed."
    exit 1
fi

# Fix permission issue with npm install
sudo chown -R ubuntu:ubuntu /home/ubuntu/database

# # Clone repo
# cd /home/ubuntu
# rm -rf blog-api
# git clone https://github.com/neyo55/blog-api.git
# cd blog-api/database

# Make Docker Compose executable and bring up
# docker-compose up -d

echo "MongoDB tier setup completed successfully rebooting the instance."

# Reboot the instance 
sudo reboot
