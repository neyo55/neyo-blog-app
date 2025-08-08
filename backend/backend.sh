#!/bin/bash

LOG_FILE="/var/log/backend.log"
exec > >(tee -a "$LOG_FILE") 2>&1
exec 2> >(tee -a "$LOG_FILE" >&2)
set -euo pipefail

echo "======== Starting backend user data script at $(date) ========"

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

# Update apt
echo "Updating apt package index..."
apt-get update -y

# Install base tools
for pkg in git vim htop unzip wget build-essential python3-pip curl sysstat software-properties-common gnupg lsb-release; do
    if ! dpkg -s "$pkg" &>/dev/null; then
        echo "Installing $pkg..."
        apt-get install -y "$pkg"
    else
        echo "$pkg already installed."
    fi
done

# Install AWS CLI
if ! is_installed aws; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    ./aws/install
    rm -rf awscliv2.zip aws
else
    echo "AWS CLI already installed."
fi

# Install Node.js v20 and npm (compatible with backend)
if ! is_installed node || ! is_installed npm; then
    echo "Installing Node.js v20 and npm..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js and npm already installed."
fi

# Install PM2 globally to manage Node.js processes
if ! is_installed pm2; then
    echo "Installing PM2 globally..."
    npm install -g pm2
else
    echo "PM2 already installed."
fi


# Install Docker
if ! is_installed docker; then
    echo "Installing Docker..."
    apt-get install -y docker.io
    systemctl start docker
    systemctl enable docker
else
    echo "Docker already installed."
fi

# Add ubuntu user to docker group
if id -nG ubuntu | grep -qw docker; then
    echo "'ubuntu' is already in docker group."
else
    usermod -aG docker ubuntu
    echo "Added 'ubuntu' to docker group."
fi

# Install Docker Compose
if ! is_installed docker-compose; then
    echo "Installing Docker Compose v2..."
    DOCKER_COMPOSE_VERSION="2.24.0"
    curl -SL "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose already installed."
fi


# # Clone your GitHub repo (replace with your actual repo)
# echo "Cloning backend repository..."
# cd /home/ubuntu
# rm -rf blog-api  # In case re-running script
# git clone https://github.com/neyo55/blog-api.git
# cd blog-api/backend

# Fix permission issue with npm install
sudo chown -R ubuntu:ubuntu /home/ubuntu/backend


# Create .env if needed (Optional: mount secrets securely or echo them here)
# echo "PORT=3000" > .env

# Start the backend using Docker Compose
# echo "Starting backend with Docker Compose..."
# docker-compose up -d --build

echo "======== Backend setup completed successfully at $(date) and rebooting the instance ========"

# Reboot the instance 
sudo reboot

















# #!/bin/bash

# LOG_FILE="/var/log/user-data-backend.log"
# exec > >(tee -a "$LOG_FILE") 2>&1
# exec 2> >(tee -a "$LOG_FILE" >&2)
# set -euo pipefail

# echo "======== Starting user data script at $(date) ========"

# export DEBIAN_FRONTEND=noninteractive

# trap 'echo "[ERROR] Script failed at line $LINENO. Check $LOG_FILE for details."; exit 1' ERR

# handle_error() {
#     echo "[ERROR] Script failed at line $1. Check $LOG_FILE for details."
#     exit 1
# }
# trap 'handle_error $LINENO' ERR

# # Utility function to check if a command exists
# is_installed() {
#     command -v "$1" &> /dev/null
# }

# # Update packages (safe to run every time)
# echo "Updating apt package index..."
# apt-get update -y

# # Install base tools if not present
# install_package() {
#     if ! dpkg -s "$1" &>/dev/null; then
#         echo "Installing $1..."
#         apt-get install -y "$1"
#     else
#         echo "$1 is already installed."
#     fi
# }

# # Install base tools
# for pkg in git vim htop unzip wget build-essential python3-pip curl sysstat software-properties-common gnupg lsb-release; do
#     install_package "$pkg"
# done


# # Install AWS CLI (universal method)
# if ! is_installed aws; then
#     echo "Installing AWS CLI..."
#     curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
#     unzip awscliv2.zip
#     sudo ./aws/install
#     rm -rf awscliv2.zip aws
# else
#     echo "AWS CLI is already installed."
# fi

# # Install Node.js + npm (latest)
# if ! is_installed node || ! is_installed npm; then
#     echo "Installing Node.js and npm..."
#     curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
#     apt-get install -y nodejs
#     npm install -g npm@latest
# else
#     echo "Node.js and npm are already installed."
# fi


# # Install Docker
# if ! is_installed docker; then
#     echo "Installing Docker..."
#     apt-get install -y docker.io
#     systemctl start docker
#     systemctl enable docker
# else
#     echo "Docker is already installed."
# fi

# # Add 'ubuntu' user to docker group (if not already in group)
# if id -nG ubuntu | grep -qw docker; then
#     echo "'ubuntu' user is already in the docker group."
# else
#     usermod -aG docker ubuntu
#     echo "Added 'ubuntu' user to docker group. Logout/login may be required to apply."
# fi

# # Install Docker Compose v2
# if ! is_installed docker-compose; then
#     echo "Installing Docker Compose v2..."
#     DOCKER_COMPOSE_VERSION="2.24.0"
#     curl -SL "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
#     chmod +x /usr/local/bin/docker-compose
# else
#     echo "Docker Compose is already installed."
# fi


# echo "Backend apps installation and configuration completed."
# echo "======== Backend user data script completed successfully at $(date) ========"
