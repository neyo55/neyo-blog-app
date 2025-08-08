#!/bin/bash

# Allocate 2GB swap file
echo "[INFO] Creating 2G swap file..."
sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048

# Secure permissions
sudo chmod 600 /swapfile

# Make swap
sudo mkswap /swapfile

# Enable swap
sudo swapon /swapfile

# Make it permanent
grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
echo "[INFO] Swap setup complete:"
swapon --show
free -h
