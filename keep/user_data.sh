#!/bin/bash

LOG_FILE="/var/log/user-data-frontend.log"
exec > >(tee -a "$LOG_FILE") 2>&1
exec 2> >(tee -a "$LOG_FILE" >&2)
set -euo pipefail

echo "======== Starting user data script at $(date) ========"

export DEBIAN_FRONTEND=noninteractive

trap 'echo "[ERROR] Script failed at line $LINENO. Check $LOG_FILE for details."; exit 1' ERR

handle_error() {
    echo "[ERROR] Script failed at line $1. Check $LOG_FILE for details."
    exit 1
}
trap 'handle_error $LINENO' ERR

# Utility function to check if a command exists
is_installed() {
    command -v "$1" &> /dev/null
}

# Update packages (safe to run every time)
echo "Updating apt package index..."
apt-get update -y

# Install base tools if not present
install_package() {
    if ! dpkg -s "$1" &>/dev/null; then
        echo "Installing $1..."
        apt-get install -y "$1"
    else
        echo "$1 is already installed."
    fi
}

# Install base tools
for pkg in git vim htop unzip wget build-essential python3-pip curl sysstat software-properties-common gnupg lsb-release; do
    install_package "$pkg"
done

# Install Nginx
install_package nginx
systemctl enable nginx
systemctl start nginx

# Install AWS CLI (universal method)
if ! is_installed aws; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf awscliv2.zip aws
else
    echo "AWS CLI is already installed."
fi

# Install Node.js v20 and npm (compatible with backend)
if ! is_installed node || ! is_installed npm; then
    echo "Installing Node.js v20 and npm..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js and npm already installed."
fi

# Install Certbot + Nginx plugin
install_package certbot
install_package python3-certbot-nginx

# Install Docker
if ! is_installed docker; then
    echo "Installing Docker..."
    apt-get install -y docker.io
    systemctl start docker
    systemctl enable docker
else
    echo "Docker is already installed."
fi

# Add 'ubuntu' user to docker group (if not already in group)
if id -nG ubuntu | grep -qw docker; then
    echo "'ubuntu' user is already in the docker group."
else
    usermod -aG docker ubuntu
    echo "Added 'ubuntu' user to docker group. Logout/login may be required to apply."
fi

# Install Docker Compose v2
if ! is_installed docker-compose; then
    echo "Installing Docker Compose v2..."
    DOCKER_COMPOSE_VERSION="2.24.0"
    curl -SL "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose is already installed."
fi

# Clone your GitHub repo (replace with your actual repo)
echo "Cloning frontend repository..."
cd /home/ubuntu
rm -rf blog-api  # In case re-running script
git clone https://github.com/neyo55/blog-api.git
cd blog-api/frontend

# Move frontend to /home/ubuntu
echo "Moving frontend to /home/ubuntu..."
sudo mv /home/ubuntu/blog-api/frontend/ /home/ubuntu/

# Fix permission issue with npm install
sudo chown -R ubuntu:ubuntu /home/ubuntu/frontend



echo "Frontend installation and configuration completed."
echo "======== Frontend user data script completed successfully at $(date) ========"
